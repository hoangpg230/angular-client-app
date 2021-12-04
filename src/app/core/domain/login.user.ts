export class LoginUser {
    constructor(
        access_token: string, 
        UserId: string, 
        Email: string, 
        Name: string, 
        Avatar: string, 
        Address: string,
        PhoneNumber: string
        ) {
        this.access_token = access_token;
        this.UserId = UserId;
        this.Email = Email;
        this.Name = Name;
        this.Avatar = Avatar;
        this.Address = Address;
        this.PhoneNumber = PhoneNumber;
    }

    public access_token: string
    public UserId: string;
    public Email: string;
    public Name: string;
    public Avatar: string;
    public Address: string;
    public PhoneNumber: string;
}