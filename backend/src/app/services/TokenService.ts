import { Keypair, TransactionBuilder,Server, Account, Networks, Operation, Asset, Claimant } from "xdb-digitalbits-sdk";

interface TokenServiceResult{
    success : boolean
    txhash?: string
    error?: any
}


export class TokenService{
    server: Server
    network: Networks
    // issuer keypair
    tokenKeypair = Keypair.fromSecret("SAR56VOVHXC7ZINANV2T6XVL4RMP2VBODJCLS5VLCUEMCMDJ7ZSAPPVJ") // todo
    distributionKeypair = Keypair.fromSecret("SDKUNHTR63H3NEYA2HBXS42GCFT64PIIBDM2FW5B77RMMT3S5PAOEXH3") // todo
    

    constructor(server: Server, network : Networks = Networks.TESTNET ){
        this.server = server
        this.network = network
        // this.server.friendbot(this.tokenKeypair.publicKey())
        // this.server.friendbot(this.distributionKeypair.publicKey())

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
     * 
     * @param userId user to get keypairs for
     * @returns [tokenKeypair, distributionKeypair]
     */
    async getKeyPairsForUserId(userId:string) : Promise<[Keypair, Keypair]>{
        return [this.tokenKeypair,this.distributionKeypair]
    }



    /**
     * @param userId Some kind of id to find the keypairs of the user requesting this function.
     * @param tokenId Short token identifier. Up to 12 characters.
     * @param tokenName Long token name.
     * @param imageUrl The image of the token should have.
     * @param description Extra info about the token.
     * @param initialAmount Initial amount to mint. todo
     */
    async issueToken(userId:string, tokenId: string, tokenName: string, imageUrl: string, description: string, initialAmount: string) : Promise<TokenServiceResult>{
        const baseFee = await this.server.fetchBaseFee()

        const [tokenKeypair,distributionKeypair] = await this.getKeyPairsForUserId(userId)
        
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
        
        let error = false
        const serverRes = await this.server.submitTransaction(createTokenTx).catch(err =>{error=true; return err})
        
        let result : TokenServiceResult
        if(error){
            result = {
                success : false,
                error: serverRes
            }
        }else{
            result = {
                success : true,
                txhash : serverRes.hash
            }
        }
        return result
    }
    /**
     * Pay some recipients with an asset by creating a claimable balance. Usefull if the recipients don't have trustlines to the assets.
     * 
     * @param userId Some kind of id to find the keypairs of the user requesting this function.
     * @param tokenId Short token identifier. Up to 12 characters.
     * @param recipients array of typles to indicate the recipients and the amount to send them individually.
     */
    async payWithClaimableBalances(userId: string, tokenId: string, recipients: Array<{address: string, amount: string}>) : Promise<TokenServiceResult>{
        const baseFee = await this.server.fetchBaseFee()
        
        const [tokenKeypair,distributionKeypair] = await this.getKeyPairsForUserId(userId)

        const account = await this.server.loadAccount(distributionKeypair.publicKey())
        const asset = new Asset(tokenId,tokenKeypair.publicKey())

        const txBuilder = new TransactionBuilder(account,{fee:baseFee.toString(), networkPassphrase:this.network})
        
        recipients.forEach(({address, amount})=>{
            txBuilder.addOperation(Operation.createClaimableBalance(
                {
                    claimants: [new Claimant(address,Claimant.predicateUnconditional())],
                    amount: amount,
                    asset
                }
            ))
        })

        const tx = txBuilder.setTimeout(0).build()

        tx.sign(distributionKeypair)

        const response = await this.server.submitTransaction(tx).catch((err)=> {return err})

        if(response.successful){
            return {
                success: true,
                txhash: response.hash
            }
        }else{
            return{
                success: false,
                error: response
            }
        } 
    }

    /**
     * 
     * @param userId Some kind of id to find the keypairs of the user requesting this function.
     * @param tokenId Short token identifier. Up to 12 characters.
     * @param recipients array of typles to indicate the recipients and the amount to send them individually.
     */
     async payWithPayment(userId: string, tokenId: string, recipients: Array<{address: string, amount: string}>): Promise<TokenServiceResult>{
        const baseFee = await this.server.fetchBaseFee()

        const [tokenKeypair,distributionKeypair] = await this.getKeyPairsForUserId(userId)
        
        const account = await this.server.loadAccount(distributionKeypair.publicKey())
        const asset = new Asset(tokenId,tokenKeypair.publicKey())

        const txBuilder = new TransactionBuilder(account,{fee:baseFee.toString(), networkPassphrase:this.network})
        
        recipients.forEach(({address,amount})=>{
            txBuilder.addOperation(Operation.payment(
                {
                    destination: address,
                    amount: amount,
                    asset
                }
            ))
        })

        const tx = txBuilder.setTimeout(0).build()

        tx.sign(distributionKeypair)
        const response = await this.server.submitTransaction(tx).catch((err)=> {return err})

        if(response.successful){
            return {
                success: true,
                txhash: response.hash
            }
        }else{
            return{
                success: false,
                error: response
            }
        } 
    }
}