export class UpdateRoleUserSuccess {
    constructor(
        public readonly email: string,
        public readonly token: string,
        public readonly name: string,
        public readonly reply: string
    ) {}
}
