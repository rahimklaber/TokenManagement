import {Asset, Claimant, Frontier, Keypair, Networks, Operation, Server, TransactionBuilder} from "xdb-digitalbits-sdk";
import BalanceLineAsset = Frontier.BalanceLineAsset;

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

    /**
     * Mint new tokens.
     *
     * Note that the token should already be created.
     *
     * @param userId user identifier
     * @param tokenId Token identifier.
     * @param amount amount of tokens to issue.
     */
    async mintToken(userId: string,tokenId:string, amount:string){
        const baseFee = await this.server.fetchBaseFee()

        const [tokenKeypair,distributionKeypair] = await this.getKeyPairsForUserId(userId)

        const account = await this.server.loadAccount(distributionKeypair.publicKey())
        const asset = new Asset(tokenId,tokenKeypair.publicKey())

        const createTokenTx = new TransactionBuilder(account,{fee: baseFee.toString(), networkPassphrase: this.network})
            .addOperation(
                Operation.payment({
                    asset,
                    amount: amount,
                    destination: distributionKeypair.publicKey(),
                    source: tokenKeypair.publicKey()
                })
            )
            .setTimeout(0)
            .build()

        createTokenTx.sign(tokenKeypair,distributionKeypair)

        const serverRes = await this.server.submitTransaction(createTokenTx).catch(err =>{return err})

        let result : TokenServiceResult
        if(!serverRes.successful){
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
     * Todo : use object as return type, arrays are so error prone.
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
    async payWithClaimableBalances(userId: string, tokenId: string, recipients: {address: string, amount: string}[]) : Promise<TokenServiceResult>{
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

        const response = await this.server.submitTransaction(tx).catch(err=> {return err})

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
     async payWithPayment(userId: string, tokenId: string, recipients: {address: string, amount: string}[]): Promise<TokenServiceResult>{
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
        const response = await this.server.submitTransaction(tx).catch(err=> {return err})

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
     * list the tokens the user has created.
     * todo : use db
     */
    async listTokens(userId: string) : Promise<{ tokenId: string,balance: string }[]> {
        const [,distributionKeypair] = await this.getKeyPairsForUserId(userId)

        const balances = await this.server.accounts().accountId(distributionKeypair.publicKey()).call()

        return balances.balances.filter(balance => balance.asset_type != "native").map(balance => {
            return {
                tokenId: (balance as BalanceLineAsset).asset_code,
                balance: (balance as BalanceLineAsset).balance
            }
        })
    }
}