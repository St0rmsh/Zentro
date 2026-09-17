export interface JwtPayload {
    _id:string;
    email?:string;
    roles?:("user"|"author"|"admin")[]
}