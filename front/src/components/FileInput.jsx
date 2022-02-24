import React from 'react'
import styled from 'styled-components'
import Api from '../Api'

const FileInput = styled.div`
    display: inline-block;
    vertical-align: middle;
`;

export default ({setData, api}) => {
    
    const loadText = (e) => {
        const formData = new FormData();

        const reader = new FileReader();
        const file = e.target.files[0];
        var text = null;
        reader.onloadend = () => {
            text = reader.result

            text = text.split(',')
            text = text[1]

            formData.append('file', text)

            const option = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({text})
            }
    
            Api.apiFetch(api, option)
            .then(data => {
                if(data.status) {
                    alert('Load successfully');
                    setData(data.result);
                }
                else alert('Load faild');
            })
            .catch(error => {
                console.log(error);
            });
        }

        reader.readAsDataURL(file);
    }

    return(
        <FileInput>
            <input type="file" onChange={loadText} />
        </FileInput>
    )
}