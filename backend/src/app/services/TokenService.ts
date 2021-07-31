import { Keypair, TransactionBuilder,Server, Account, Networks, Operation, Asset, Claimant } from "xdb-digitalbits-sdk";

export class TokenService{
    server: Server
    network: Networks

    constructor(server: Server, keypair: Keypair, network : Networks = Networks.TESTNET ){
        this.server = server
        this.network = network
    }

    // /**
    //  * Mint new tokens. 
    //  * 
    //  * Note that the token should allready be created.
    //  * 
    //  * @param tokenId Token identifier.
    //  * @param amount amount of tokens to issue.
    //  */
    // async mintToken(tokenId:string, amount:string){
        
    // }
    /**
     * @param userId Some kind of id to find the keypairs of the user requesting this function.
     * @param tokenId Short token identifier. Up to 12 characters.
     * @param tokenName Long token name.
     * @param imageUrl The image of the token should have.
     * @param description Extra info about the token.
     * @param initialAmount Initial amount to mint. todo
     */
    async issueToken(userId:string, tokenId: string, tokenName: string, imageUrl: string, description: string, initialAmount: string){
        const baseFee = await this.server.fetchBaseFee()

        const tokenKeypair = Keypair.random() // todo
        const distributionKeypair = Keypair.random() // todo
        
        const account = await this.server.loadAccount(distributionKeypair.publicKey())
        const asset = new Asset(tokenId,tokenKeypair.publicKey())

        const createTokenTx = new TransactionBuilder(account,{fee: baseFee.toString(), networkPassphrase: this.network})
        .addOperation(Operation.changeTrust({
            asset
        }))
        .addOperation(
            Operation.payment({
                asset,
                amount: initialAmount,
                destination: distributionKeypair.publicKey(),
                source: tokenKeypair.publicKey()
            })
        )
        .setTimeout(0)
        .build()
        
        createTokenTx.sign(tokenKeypair,distributionKeypair)

        return this.server.submitTransaction(createTokenTx)
    }
    /**
     * 
     * @param userId Some kind of id to find the keypairs of the user requesting this function.
     * @param tokenId Short token identifier. Up to 12 characters.
     * @param recipients array of typles to indicate the recipients and the amount to send them individually.
     */
    async payWithClaimableBalances(userId: string, tokenId: string, recipients: Array<[string,string]>){
        const baseFee = await this.server.fetchBaseFee()

        const tokenKeypair = Keypair.random() // todo
        const distributionKeypair = Keypair.random() // todo
        
        const account = await this.server.loadAccount(distributionKeypair.publicKey())
        const asset = new Asset(tokenId,tokenKeypair.publicKey())

        const txBuilder = new TransactionBuilder(account,{fee:baseFee.toString(), networkPassphrase:this.network})
        
        recipients.forEach(([recipient, amount])=>{
            txBuilder.addOperation(Operation.createClaimableBalance(
                {
                    claimants: [new Claimant(recipient,Claimant.predicateUnconditional())],
                    amount: amount,
                    asset
                }
            ))
        })

        const tx = txBuilder.setTimeout(0).build()

        tx.sign(distributionKeypair)

        return this.server.submitTransaction(tx)
    }

    /**
     * 
     * @param userId Some kind of id to find the keypairs of the user requesting this function.
     * @param tokenId Short token identifier. Up to 12 characters.
     * @param recipients array of typles to indicate the recipients and the amount to send them individually.
     */
     async payWithPayment(userId: string, tokenId: string, recipients: Array<[string,string]>){
        const baseFee = await this.server.fetchBaseFee()

        const tokenKeypair = Keypair.random() // todo
        const distributionKeypair = Keypair.random() // todo
        
        const account = await this.server.loadAccount(distributionKeypair.publicKey())
        const asset = new Asset(tokenId,tokenKeypair.publicKey())

        const txBuilder = new TransactionBuilder(account,{fee:baseFee.toString(), networkPassphrase:this.network})
        
        recipients.forEach(([recipient, amount])=>{
            txBuilder.addOperation(Operation.payment(
                {
                    destination: recipient,
                    amount: amount,
                    asset
                }
            ))
        })

        const tx = txBuilder.setTimeout(0).build()

        tx.sign(distributionKeypair)

        return this.server.submitTransaction(tx)
    }
}