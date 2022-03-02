// const path = require("path"),
// fs = require("fs"),
// split = require('split'),
// _ = require('underscore')
// jsonexport = require('jsonexport'),
// createCsvWriter = require('csv-writer').createObjectCsvWriter,
const nodemailer = require('nodemailer'),
    jwt = require('jsonwebtoken'),
    base64 = require('base64topdf'),
    fs = require('fs'),
    {
        Parser
    } = require('json2csv'),

    mail = require('../../config/mail'),
    doc_conf = require('../../config/doc'),
    twilio_conf = require('../../config/twilio'),

    twilio = require('twilio')(twilio_conf.accountId, twilio_conf.authToken),
    Contractor = require("../../models/Contractor"),
    Task = require("../../models/Task"),
    Docket = require("../../models/Docket"),
    History = require("../../models/History");

    const {
        PDFDocument,
    } = require('pdf-lib');

class AdminController {
    getContractorList() {
        /**
         * select all -db - Contractor - id/firstname/lastname/username/email/password/jobsite/token/date
         */
        return Contractor.find({}).then(records => {

            return records;
        });
    }

    async addContractor(req) {
        /**
         * select all -db - Contractor - id/firstname/lastname/username/email/password/jobsite/[token]/date
         */
        var email = req.email;
        var exist = false;

        exist = await Contractor.findOne({
            email: email,
        }).then(record => {
            if (record) 
                return true;
            else return false;
        });

        exist = await Contractor.findOne({
            username: req.username,
        }).then(record => {
            if (record) 
                return true;
            else return false;
        });

        if(exist)
            return false;

        return await Contractor.findOne({
            email: email,
            username: req.username
        }).then(record => {
            if (!record) {
                record = new Contractor({
                    firstname: req.firstname,
                    lastname: req.lastname,
                    username: req.username,
                    email: req.email,
                    phone: req.phone,
                    password: req.password,
                    jobsite: req.jobsite
                })
                return record.save().then(result => {
                    return Contractor.find({}).then(records => {
                        return records;
                    });
                })
            } else
                exist = true;
        });

        // if(exist)
        //     return false;

        // return Contractor.find({}).then(records => {
        //     return records;
        // });
    }

    async loadUserFromText(req) {
        /**
         * load text
         * text-json
         * create - db - Task - id/code/title/description/date
         */

        var load = await this.loadDataFromText(req.text);
        console.log('load', load);
        if(load)
            return Contractor.find({}).then(result => {return result});
        else return false;

    }

    async loadDataFromText(data) {
        var index = 0;
        let regex = new RegExp('[^\\n\\r\\t\\"]+', 'g');
        let useHeader = true;
        let buff = new Buffer(data, 'base64');
        let text = buff.toString('ascii');
        var dict = new Object();
        var line = text.toString().match(regex);

        console.log('userdata', JSON.stringify(line));
        
            if (line)
                while (index < line.length - 8) {

                    if (useHeader) {
                        dict[index % 8] = line[8 + index];
                        if (index > 0 && index % 8 === 7) {
                            await Contractor.findOne({
                                code: dict[0]
                            }).then(record => {
                                if (!record) {
                                    try{
                                        record = new Contractor({
                                            firstname: dict[0] == '__' ? '' : dict[0],
                                            lastname: dict[1] == '__' ? '' : dict[1],
                                            jobsite: dict[2] == '__' ? '' : dict[2],
                                            username: dict[3] == '__' ? '' : dict[3],
                                            password: dict[4] == '__' ? '' : dict[4],
                                            phone: dict[5] == '__' ? '' : dict[5],
                                            email: dict[6] == '__' ? '' : dict[6],
                                            date: dict[7] == '__' ? '' : dict[7],
                                            // _id: dict[8] == '__' ? '' : dict[8]
                                        });
                                        record.save();
                                    }catch(error) {
                                        return false;
                                    }
                                }
                            });
                        }
                    }

                    index++;
                    if(index == line.length - 8) {
                        return true;
                    }
                }
        
    }

    async exportUser2Text() {
        const contractors = await Contractor.find().then(result => {
            return result;
        });

        var data = [];

//         if(!fs.existsSync(doc_conf.backup_contractor_doc)) {
//             fs.mkdirSync(doc_conf.backup_contractor_doc);
//         }
            
        const fields = doc_conf.exportcontractorheader;

        for (const index in contractors) {
            var item = contractors[index];
            var temp = {};
            temp[fields[0]] = item.firstname == '' ? '__\t\t' : item.firstname;
            temp[fields[1]] = item.lastname == '' ? '__\t\t' : item.lastname;
            temp[fields[2]] = item.jobsite == '' ? '__\t\t' : item.jobsite;
            temp[fields[3]] = item.username == '' ? '__\t\t' : item.username;
            temp[fields[4]] = item.password == '' ? '__\t\t' : item.password;
            temp[fields[5]] = item.phone == '' ? '__\t\t' : item.phone;
            temp[fields[6]] = item.email == '' ? '__\t\t' : item.email;
            temp[fields[7]] = item.date == '' ? '__\t\t' : item.date;
            // temp[fields[8]] = item._id == '' ? '__\t\t' : item._id;

            data.push(temp);
        }

        let regex = new RegExp("/\*/", 'g');

        
        const json2csvParser = new Parser({
            fields,
            quote: '',
            delimiter: '\t\t'
        });
        var tsv = json2csvParser.parse(data);

        tsv = await tsv.replace(regex, '');
        return tsv;
        // fs.writeFileSync(doc_conf.backup_contractor_doc, tsv);
    }
    async editContractor(req) {
        /**
         * update all -db - Contractor - id/firstname/lastname/username/email/password/jobsite/[token]/date
         */
        var _id = req._id
        return await Contractor.findOne({
            _id: _id
        }).then(record => {
            if (record) {
                record.firstname = req.firstname;
                record.lastname = req.lastname;
                record.username = req.username;
                record.email = req.email;
                record.phone = req.phone;
                record.password = req.password;
                record.jobsite = req.jobsite;

                return record.save().then(result => {
                    return Contractor.find({}).then(records => {
                        return records;
                    });
                });

            }
        })

        
    }

    async deleteContractor(req) {
        /**
         * delete -db- Contractor - id
         */

        var _id = req._id;
        await Contractor.findByIdAndRemove(_id);

        return Contractor.find({}).then(records => {
            return records;
        });
    }

    async sendInvite(req) {
        /**
         * create token
         * update -db - Contractor - id - token
         * select -db- Contractor - id - email/token
         */
        // var privatekey = fs.readFileSync('private.key')
        var username = req.username;
        var email = req.email;
        var phone = req.phone;
        var password = req.password;

        console.log('ready for sending email')
        const token = jwt.sign({
            username,
            email,
            password
        }, 'privatekey', {
            expiresIn: mail.expireTime
        });
        this.sendEmail(email, phone, token, true);

        return true;
    }

    async sendResult(req) {
        /**
         * create token
         * update -db - Contractor - id - token
         * select -db- Contractor - id - email/token
         */
        // var privatekey = fs.readFileSync('private.key')
        var username = req.username;
        var email = req.email;
        var phone = req.phone;
        var status = req.status;

        console.log('ready for sending email');

        return this.sendEmail(email, phone, status, false);
    }

    loadDocket() {
        /**
         * 
         * select - db - Docket - id/code/title/description/date
         */

        return Docket.find({
            path: {
                $exists: true
            }
        }).then(result => {
            return result;
        });

    }

    async export2TextDocket() {
        const dockets = await Docket.find({
            path: {
                $exists: true
            }
        }).then(result => {
            return result;
        });

        var data = [];

        const fields = doc_conf.exportheader;

        for (const index in dockets) {
            var item = dockets[index];
            var temp = {};
            temp[fields[0]] = item.contractorname == '' ? '__\t\t' : item.contractorname;
            temp[fields[1]] = item.docno == '' ? '__\t\t' : item.docno;
            temp[fields[2]] = item.path == '' ? '__\t\t' : item.path;
            temp[fields[3]] = item.status == '' ? '__\t\t' : item.status;
            temp[fields[4]] = item.date == '' ? '__\t\t' : item.date;
            // temp[fields[5]] = item.contractorid == '' ? '__\t\t' : item.contractorid;

            data.push(temp);
        }

        // let regex = new RegExp("/\*/", 'g');

        
        const json2csvParser = new Parser({
            fields,
            quote: '',
            delimiter: '\t\t'
        });
        var tsv = json2csvParser.parse(data);

        // tsv = await tsv.replace(regex, '');

        fs.writeFileSync(doc_conf.backup_doc, tsv);

    }

    async uploadDocketWithSign(req) {

        var path = "";
        await Docket.findOne({
            _id: req.docketid
        }).then(record => {
            if (record) {
                path = record.path;
            }
        })
        if (req.data) {
            await base64.base64Decode(req.data, path);

            await Docket.findOneAndUpdate({
                _id: req.docketid
            }, {
                $set: {
                    status: 'Signed'
                }
            });
            console.log('data');
        }

        req.id = req.docketid;

        this.export2TextHistory(req).then(data => {
            try {
                this.sendEmail(req.email, null, data['data'], false)
            } catch (error) {
                console.log(error)
            }
    
        });

        if (req.notes) {
            await Docket.findOneAndUpdate({
                _id: req.docketid
            }, {
                $set: {
                    notes: req.notes
                }
            });
            console.log('notes', req.notes);
        }

        var result = await Docket.find({
            path: {
                $exists: true
            }
        });
        return result;
    };

    viewDocket(req) {
        /**
         * select - db - Docket - id - path/[username][datetime]
         */
        var _id = req._id
        return Docket.findOne({
            key: _id
        }).then(result => {
            return result.path;
        })

    }

    async deleteDocket(req) {
        /**
         * delete - db - Task -id
         */

        var _id = req._id;
        await Docket.findByIdAndRemove(_id);

        return Docket.find({
            path: {
                $exists: true
            }
        }).then(result => {
            return result;

        })
    }

    async respondResult(req) {
        /**
         * update - db - Docket - id - status
         */
        var id = req._id;

        await Docket.findOneAndUpdate({
            _id: id
        }, {
            $set: {
                status: req.status
            }
        });

        return Docket.find({
            path: {
                $exists: true
            }
        }).then(result => {
            return result;
        })
    }

    sendRespond(req) {
        /**
         * select - db - Docket - id - status
         */
        var email = req.email;
        var _id = req._id;
        var status = '';
        var data = Docket.findOne({
            key: _id
        }).then(result => {
            status = result.status;
        })

        this.sendEmail(email, data, false);

        console.log('ready for sending email');
    }

    async loadTaskFromText(req) {
        /**
         * load text
         * text-json
         * create - db - Task - id/code/title/description/date
         */

        var index = 0;
        var outData = [];
        let regex = new RegExp("[^\\n\\r\\t ]+", 'g');
        let useHeader = true;
        let keys = [];
        let word = [];
        let buff = new Buffer(req.text, 'base64');
        let text = buff.toString('ascii');
        var dict = new Object();
        var line = text.toString().match(regex);
        try{
            if (line)
                while (index < line.length - 4) {

                    if (useHeader) {
                        dict[index % 4] = line[4 + index];
                        if (index > 0 && index % 4 === 3) {
                            await Task.findOne({
                                code: dict[0]
                            }).then(record => {
                                if (!record) {
                                    record = new Task({
                                        code: dict[0] == '__' ? '' : dict[0],
                                        title: dict[1] == '__' ? '' : dict[1],
                                        description: dict[2] == '__' ? '' : dict[2],

                                    })
                                    record.save();
                                }
                            })
                        }
                    }

                    index++;
                }

            const result = await Task.find({});
            return result;
        }catch(error){
            return false;
        }

    }

    loadTask() {
        /**
         * 
         * select - db - Task - id/code/title/description/date
         */
        return Task.find({}).then(result => {
            return result
        })
    }

    newTask(req) {
        /**
         * update - db - Task - id/code/title/description/date
         */

        var code = req.code
        return Task.findOne({
            code: code
        }).then(record => {
            if (!record) {
                record = new Task({
                    code: req.code,
                    title: req.title,
                    description: req.description,
                });
                return record.save().then(result => {
                    return Task.find({}).then(result => {
                        return result;
                    })
                })
            }
            return null;
        })
    }

    editTask(req) {
        /**
         * update - db - Task - id/code/title/description/date
         */

        var _id = req._id
        return Task.findOne({
            _id: _id
        }).then(record => {
            console.log('edit task', record)
            if (record) {
                record.title = req.title;
                record.description = req.description;
                return record.save().then(result => {
                    return Task.find({}).then(result => {
                        return result;
                    })
                })


            }
            return null;
        })
    }

    async export2TextTask() {
        const tasks = await Task.find({
            
        }).then(result => {
            return result;
        });

        var data = [];

        const fields = doc_conf.exportTaskHeader;

        for (const index in tasks) {
            var item = tasks[index];
            var temp = {};
            temp[fields[0]] = item.code == '' ? '__\t\t' : item.code;
            temp[fields[1]] = item.title == '' ? '__\t\t' : item.title;
            temp[fields[2]] = item.description == '' ? '__\t\t' : item.description;

            data.push(temp);
        }

        let regex = new RegExp("/\*/", 'g');

        
        const json2csvParser = new Parser({
            fields,
            quote: '',
            delimiter: '\t\t'
        });
        var tsv = json2csvParser.parse(data);

        // tsv = await tsv.replace(regex, '');

        // fs.writeFileSync(doc_conf.backup_doc, tsv);

        tsv = await tsv.replace(regex, '');
        var result = [];
        result['data'] = tsv;

        return result;

    }

    async removeTask(req) {
        /**
         * delete - db - Task -id
         */

        var _id = req._id;
        await Task.findByIdAndRemove(_id, function (err, doc) {

        });

        return Task.find({}).then(result => {
            return result;

        })
    }

    async loadHistory() {
        /**
         * 
         * select - db - History - id/code/title/description/date
         */

        return History.find({}).then(result => {
             return result;
         });

        // return History.aggregate([{
        //     $lookup: {
        //         from: 'contractors',
        //         localField: 'contractor',
        //         foreignField: '_id',
        //         as: 'Contractor'
        //     }
        // }
        // ]);
    }

    async removeHistory(req) {
        /**
         * delete - db - History -id
         */

        var _id = req._id;
        await History.findByIdAndRemove(_id, function (err, doc) {
        });

        return History.find({}).then(result => {
            return result;

        })
    }

    async export2TextHistory(req) {

        const docket = await Docket.findOne({
            _id: req.id
        }).then(result => {return result});

        var history = await History.find({'username': {$eq: docket.contractorname}, 'date': {$eq: docket.date}}).then(result => {
            return result;
        });

        // const history = await History.findOne({
        //     _id: req.id
        // }).then(result => {return result});
        
        var data = [];

        const fields = doc_conf.exporthistoryheader;

        for (const index in history) {
            var item = history[index];
            var temp = {};
            temp[fields[0]] = item.date == '' ? '__\t\t' : item.date;
            temp[fields[1]] = item.taskcode == '' ? '__\t\t' : item.taskcode;
            temp[fields[2]] = item.lastname == '' ? '__\t\t' : item.lastname;
            temp[fields[3]] = item.firstname == '' ? '__\t\t' : item.firstname;
            temp[fields[4]] = item.hour == '' ? '__\t\t' : item.hour;
            temp[fields[5]] = '__\t\t';
            temp[fields[6]] = '__\t\t';
            temp[fields[7]] = item.notes == '' ? '__\t\t' : item.notes;
            temp[fields[8]] = '__\t\t';
            temp[fields[9]] = '__\t\t';
            temp[fields[10]] = '__\t\t';
            temp[fields[11]] = '__\t\t';
            temp[fields[12]] = item.starttime == '' ? '__\t\t' : item.starttime;
            temp[fields[13]] = item.endtime == '' ? '__\t\t' : item.endtime;
            temp[fields[14]] = '__\t\t';
            temp[fields[15]] = '__\t\t';
            temp[fields[16]] = item.contractor == '' ? '__\t\t' : item.contractor;

            data.push(temp);
        }

        let regex = new RegExp("/\*/", 'g');

        
        const json2csvParser = new Parser({
            fields,
            quote: '',
            delimiter: '\t\t'
        });
        var tsv = json2csvParser.parse(data);

        tsv = await tsv.replace(regex, '');
        var result = [];
        result['data'] = tsv;
        result['docket_name'] = 'docket_' + docket.contractorname + '_' + docket.date;

        
        return result;

        // fs.writeFileSync(doc_conf.backup_history_doc, tsv);

    }

    sendEmail(email, phone, data, invite) {
        var transporter = nodemailer.createTransport({
            service: 'mailtrap', //replace gmail or mailchimp for real email
            auth: mail.mailtrap //replace mail.mailchimp for real email into config/mail.js
        });

        if (!invite) {
            
            var mailOptions = {
                from: mail.from,
                to: email,
                subject: 'Respond',
                html: `<p>${data}</p>`
            }
        } else {
            mailOptions = {
                from: mail.from,
                to: email,
                subject: 'Invite Login',
                html: `<a href='http://ec2-3-25-237-156.ap-southeast-2.compute.amazonaws.com/contractor/invite/${data}'> to signin into system , please click  here: </a>`
            }

        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        })
        if(phone != null)
        twilio.messages
            .create({
                body: `<a href='http://ec2-3-25-237-156.ap-southeast-2.compute.amazonaws.com/contractor/invite/${data}'> to signin into system , please click  here: </a>`,
                from: twilio_conf.fromPhone,
                to: phone
            })
            .then(message => console.log(message.sid));
    }

    async uploadMSDS(req) {
        try {
            var pdfDoc = await PDFDocument.load(req.text);
            if(pdfDoc !== null) {
                const pdfBytes =  await pdfDoc.save();
                await fs.writeFileSync(doc_conf.msds_doc, pdfBytes);
            } else {
                return false;
            }
        } catch (error) {
            console.log("loading error", error)
            return false;
        }
        return true;
    }
}

module.exports = new AdminController();