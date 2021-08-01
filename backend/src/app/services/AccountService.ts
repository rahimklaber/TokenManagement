import {Asset, Claimant, Frontier, Keypair, Networks, Operation, Server, TransactionBuilder} from "xdb-digitalbits-sdk";


export class AccountService{
    server: Server
    network: Networks


    constructor(server: Server, network : Networks = Networks.TESTNET ){
        this.server = server
        this.network = network
    }

    // todo mainnet?
    async createAndFundNewAccount(): Promise<string>{
        const keypair = Keypair.random()
        await this.server.friendbot(keypair.publicKey()).call()
        return keypair.secret()
    }
}