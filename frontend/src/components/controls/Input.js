import React from 'react'
import { TextField } from '@material-ui/core';

export default function Input(props) {

    const { name, label, value,error=null, onChange, readonly, ...other } = props;
    return (
        <TextField
            id="standard-basic"
            disabled={readonly}
            variant="outlined" //이거 지우면 됨.
            label={label}
            name={name}
            value={value}
            onChange={onChange}
            readOnly="readonly"

            {...other}
            {...(error && {error:true,helperText:error})}
        />
    )
}
