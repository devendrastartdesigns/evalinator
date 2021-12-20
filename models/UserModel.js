class  User{
  constructor(Id,Email,EmailConfirmed,PasswordHash,SecurityStamp,PhoneNumber,PhoneNumberConfirmed,UserName,FirstName,LastName){
    this.Id = Id;
    this.Email = Email;
    this.EmailConfirmed = EmailConfirmed;
    this.PasswordHash = PasswordHash;
    this.SecurityStamp = SecurityStamp;
    this.PhoneNumber = PhoneNumber;
    this.PhoneNumberConfirmed = PhoneNumberConfirmed;
    
    this.TwoFactorEnabled = profile_url;
    this.LockoutEndDateUtc = profile_url;
    this.LockoutEnabled = profile_url;
    this.AccessFailedCount = profile_url;


    this.UserName = UserName;
    this.FirstName = FirstName;
    this.LastName = LastName;
    
    
    
  }
}

module.exports = User;