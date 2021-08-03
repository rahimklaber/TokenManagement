import { Grid, Table, TableContainer, Paper, TableHead, TableRow, TableCell, TableBody } from "@material-ui/core";
import { render } from "@testing-library/react";
import React from "react";


interface TokensProps{
    tokens : {tokenId:string,balance:string}[]
}




export class Tokens extends React.Component<TokensProps,any >{



    render(){
        const rows = this.props.tokens.map(token =>{
            return (
                <TableRow key={token.tokenId}>
                    <TableCell>
                        {token.tokenId}
                    </TableCell>
                    <TableCell>

                    </TableCell>
                    <TableCell>
                        {token.balance}
                    </TableCell>
                </TableRow>
            )
        })
        return (
            <div>
                <h2>
                    Manage Assets
                </h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Asset id
                            </TableCell>
                            <TableCell>
                                Asset name
                            </TableCell>
                            <TableCell>
                                Current balance
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows}
                    </TableBody>
                </Table>
            </TableContainer>
            </div>
        )
    }

}