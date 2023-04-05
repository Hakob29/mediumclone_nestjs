import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";
import { JwtTokenResponseInterface } from './response/jwt-response.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly jwtService: JwtService
    ) { }

    //SIGNIN
    async signIn(dto: SignInDto): Promise<JwtTokenResponseInterface> {
        try {
            const user = await this.userRepo.findOne({ where: { email: dto.email } });
            if (!user) throw new HttpException("NOT FOUND!", HttpStatus.NOT_FOUND);
            if (!(await bcrypt.compare(dto.password, user.password))) throw new HttpException("PASSWORD WRONG!", HttpStatus.BAD_REQUEST);
            const payload = ({ username: user.username, sub: user.id });
            return {
                access_token: await this.jwtService.sign(payload)
            }

        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
        }
    }
}

