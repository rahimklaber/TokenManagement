import {Button, makeStyles, Paper, TextField} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {useState} from "react";

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
    title: {
        textAlign: "center"
    },
}));

export function IssueToken() {
    const classes = useStyles();
    const history = useHistory()

    const [tokenId, setTokenId] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [amount, setAmount] = useState("")
    const [imageUrl, setImageUrl] = useState("")

    return (
        <div>
            <h2 className={classes.title}>
                Create new tokens
            </h2>

            <Paper className={classes.form}>
                <TextField label="Token id" required value={tokenId} onChange={(event) => setTokenId(event.target.value)}/>
                <TextField label="Token name" required  value={tokenName} onChange={(event) => setTokenName(event.target.value)}/>
                <TextField label="Amount to mint" required value={amount} onChange={(event) => setAmount(event.target.value)}/>
                <TextField label="image Url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)}/>
                <Button color="primary" variant="contained">
                    Create token
                </Button>
            </Paper>
        </div>
    )
}