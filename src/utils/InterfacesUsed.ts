
// Models Interfaces

export interface IUser {
    username: string,
    password: string,
    email: string,
    resetToken: string,
    resetTokenExpiry: Date
}

export interface IUserAccount {
    name: string,
    badgeName: string,
    email: string,
    groupNames: Array<string>,
    currentTask: [task: string, badgeNameOfGroupAdmin: string],
    adminOf: Array<string>,
    isSiteAdmin: boolean,
    isGroupAdmin: boolean,
}

export interface IGroup {
    groupName: string,
    admins: Array<string>,
    members: Array<string>,
}


export interface Schedule {
    
}

export interface IQRCode {

}
