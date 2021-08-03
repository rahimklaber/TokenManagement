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

interface DistributeTokensProxy{
    issueTokenProxy : (tokenId: string, tokenName: string, amount: string, imageUrl : string) => void
}

export function DistributeTokens(props: DistributeTokensProxy) {
    const classes = useStyles();
    const history = useHistory()

    const [recipient,setRecipient] = useState("")
    const [token, setToken] = useState("")
    const [amount, setAmount] = useState("")

    return (
        <div>
            <h2 className={classes.title}>
                Distribute Tokens
            </h2>

            <Paper className={classes.form}>
                <TextField label="Recipient" required value={tokenId} onChange={(event) => setTokenId(event.target.value)}/>
                <TextField label="Token name" required  value={tokenName} onChange={(event) => setTokenName(event.target.value)}/>
                <TextField label="Amount to mint" required value={amount} onChange={(event) => setAmount(event.target.value)}/>
                <Button color="primary" variant="contained" onClick={() => {props.issueTokenProxy(tokenId,tokenName,amount,imageUrl)
                    history.push("/manage")
                }}>
                    Create token
                </Button>
            </Paper>
        </div>
    )
}