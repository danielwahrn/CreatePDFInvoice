const express = require('express');
const app = express()

require("dotenv").load();
const fs = require("fs")
const router = express.Router()

const AdminController = require('./controller')

router.get("/getcontractors", (req, res) => {

    AdminController.getContractorList().then(result => {
        return res.status(200).json({result, status: true})
    })
})

router.post("/addcontractor", (req, res) => {
    AdminController.addContractor(req.body).then(result => {
        if(result === false){
            console.log('add new contractor', 'already exist')
            return res.status(400).json({result:'already exist user with same username or email', status: false})
        }
        return res.status(200).json({result, status: true})
    })
    .catch(error => {
        console.log('add new contractor error', error)
    })
})

router.post("/loaduserfromtext", (req,res) => {
    AdminController.loadUserFromText(req.body).then(result => {
        if(!result) return res.status(200).json({status: false});
        return res.status(200).json({result: result, status: true});
    })
})

router.get("/exportuser2text", (req, res) => {
    AdminController.exportUser2Text(req.body).then(result => {
        return res.status(200).json({result: result, status: true})
    })
})

router.post("/editcontractor", (req, res) => {
    AdminController.editContractor(req.body).then(result => {
        return res.status(200).json({result: result, status: true})
    })
})

router.post("/deletecontractor", (req, res) => {
    AdminController.deleteContractor(req.body).then(result => {
        return res.status(200).json({result: result, status: true})
    })
})

router.post("/sendInvite", (req, res) => {
    AdminController.sendInvite(req.body)
    .then(result => {
        if(result)
        return res.status(200).json({status: true})
        else return res.status(400).json({status: false})
    })
});

router.post("/respondresult", (req, res) => {
    AdminController.respondResult(req.body).then(result => {
        return res.status(200).json({result: result, status: true})
    })
});

router.post("/sendresult", (req, res) => {
    AdminController.sendResult(req.body).then(result => {
        return res.status(200).json({status: true})
    })
});

router.get("/loaddocket", (req, res) => {
    AdminController.loadDocket().then(result => {
        return res.status(200).json({result: result, status: true})
    })
})

router.post("/uploaddoc", (req, res) => {
    AdminController.uploadDocketWithSign(req.body).then(result => {
        return res.status(200).json({result:result, status: true})
    })
});

router.post("/viewdocket", (req, res) => {
    try{
        console.log(req.body.url)
        var file= fs.createReadStream(req.body.url);
        file.on('error', function(){return res.status(200).json({message: 'Not find file', status: false})})
        file.pipe(res);
    }
    catch(error){
        console.log(error)
        return res.status(200).json({message: 'Not find file', status: false})
    }
})

router.post("/deletedocket", (req, res) => {
    AdminController.deleteDocket(req.body).then(result => {
        return res.status(200).json({result: result, status: true})
    })
})

router.post("/loadtaskfromtext", (req, res) => {
    AdminController.loadTaskFromText(req.body).then(result => {
        if(!result) return res.status(200).json({status: false});
        return res.status(200).json({result: result, status: true})
    })
});

router.get("/loadtask", (req, res) => {
    AdminController.loadTask().then(result => {
        return res.status(200).json({result: result, status: true})
    })
});

router.post("/newtask", (req, res) => {
    AdminController.newTask(req.body).then(result => {
        return res.status(200).json({result: result, status: true})
    })
})

router.post("/edittask", (req, res) => {
    AdminController.editTask(req.body).then(result => {
        return res.status(200).json({result: result, status: true})
    })
})

router.post("/deletetask", (req, res) => {
    AdminController.removeTask(req.body).then(result => {
        return res.status(200).json({result: result, status: true})
    })
})

router.get("/export2TextTask", (req, res) => {
    AdminController.export2TextTask(req.body).then(result => {
        return res.status(200).json({data: result['data'], status: true})
    })
})

router.get("/export2text", (req, res) => {
    AdminController.export2TextDocket(req.body).then(result => {
        return res.status(200).json({result: result, status: true})
    })
})

router.get("/loadhistory", (req, res) => {
    AdminController.loadHistory(req.body).then(result => {
        return res.status(200).json({result: result, status: true})
    })
})

router.post("/delete/history", (req, res) => {
    AdminController.removeHistory(req.body).then(result => {
        return res.status(200).json({result: result, status: true})
    })
})

router.post("/export2TextHistory", (req, res) => {
    AdminController.export2TextHistory(req.body).then(result => {
        console.log('docket', result);
        return res.status(200).json({data: result['data'], docket_name: result['docket_name'], status: true})
    })
})


module.exports = router