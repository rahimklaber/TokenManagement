/**
 * proxy-class for the backend
 */
import axios from "axios";

export class RemoteSerive{
    token : string = ""
    serviceUrl : string

    /**
     *
     * @param serviceUrl service url without '/' at the end
     */
    constructor(serviceUrl : string) {
        this.serviceUrl = serviceUrl

    }

    /**
     * login and get the jwt token
     */
    async login(username: string, password: string){
        const body = {

                username,
                password

        }
        const response = await axios.post(`${this.serviceUrl}/auth/login`,body)
        this.token = response.data.jwtToken
    }

    async register(username: string, password: string){
        const body = {
            username,
            password
        }

        const response = await axios.post(`${this.serviceUrl}/auth/register`,body)
    }

    isLoggedIn() : boolean{
        if(this.token === ""){
            return false
        }
        else{
            return true //todo
        }
    }

    async getAllTokens(): Promise<{tokenId: string, balance: string}[]> {
        const config = {
            headers : {
                "Authorization" : `Bearer ${this.token}`
            }
        }
        const response = await axios.get(`${this.serviceUrl}/token`,config)

        return response.data
    }

    async createNewToken(tokenId: string, tokenName: string, imageUrl: string,initialAmount : string){
        const config = {
            headers : {
                "Authorization" : `Bearer ${this.token}`
            }
        }

        const data = {
            tokenId,
            tokenName,
            amount : initialAmount,
            imageUrl
        }
        const response = await axios.post(`${this.serviceUrl}/token/new`,config)

    }

}