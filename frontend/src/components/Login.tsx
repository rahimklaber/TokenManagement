import { Button, makeStyles, Paper, TextField } from "@material-ui/core";
import { useState } from "react";
import {useHistory} from "react-router-dom";


interface LoginProps{
    loginProxy : (username: string, password: string) => void
}


const useStyles = makeStyles(theme => ({
    form: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(2),
  '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '300px',
      },
  '& .MuiButtonBase-root': {
        margin: theme.spacing(2),
      },
    },
    title : {
        textAlign: "center"
    },
  }));

export function Login(props: LoginProps){
    const classes = useStyles();

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const history = useHistory()


    return(
        <div>
        <h2 className={classes.title}>
            Login
        </h2>
        
        <Paper className={classes.form}>
            <TextField label="Username" required value={username} onChange={(event)=>setUsername(event.target.value)}/>
            <TextField label="password" type="password" required value={password} onChange={(event)=>setPassword(event.target.value)}/>
            <Button type="submit" variant="contained" color = "primary" onClick={(event) => {
                props.loginProxy(username, password)
                history.push("/manage")
                setUsername("")
                setPassword("")
            }}>
                Login
            </Button>
        </Paper>
        </div>
    )
}