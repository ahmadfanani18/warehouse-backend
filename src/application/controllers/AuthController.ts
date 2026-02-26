import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { LoginUseCase } from '../../domain/usecases/auth/LoginUseCase';
import { LogoutUseCase } from '../../domain/usecases/auth/LogoutUseCase';
import { GetMeUseCase } from '../../domain/usecases/auth/GetMeUseCase';
import { ChangePasswordUseCase } from '../../domain/usecases/auth/ChangePasswordUseCase';
import { ForgotPasswordUseCase } from '../../domain/usecases/auth/ForgotPasswordUseCase';
import { ResetPasswordUseCase } from '../../domain/usecases/auth/ResetPasswordUseCase';

@injectable()
export class AuthController {
  constructor(
    @inject(LoginUseCase) private readonly loginUseCase: LoginUseCase,
    @inject(LogoutUseCase) private readonly logoutUseCase: LogoutUseCase,
    @inject(GetMeUseCase) private readonly getMeUseCase: GetMeUseCase,
    @inject(ChangePasswordUseCase) private readonly changePasswordUseCase: ChangePasswordUseCase,
    @inject(ForgotPasswordUseCase) private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    @inject(ResetPasswordUseCase) private readonly resetPasswordUseCase: ResetPasswordUseCase
  ) {}

  login = async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const result = await this.loginUseCase.execute(email, password);

      if (!result.isSuccess) {
        return res.status(result.error?.statusCode || 401).json({ error: result.error?.message });
      }

      // Set cookies
      const { user, tokens } = result.value!;
      res.cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 mins
      });

      res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(200).json({
        user,
        accessToken: tokens.accessToken,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      const user = req.user;
      if (user) {
        await this.logoutUseCase.execute(user.sub);
      }

      res.clearCookie('access_token');
      res.clearCookie('refresh_token');

      return res.status(200).json({ message: 'Berhasil logout' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  getMe = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = await this.getMeUseCase.execute(userId);
      if (!result.isSuccess) {
        return res.status(404).json({ error: result.error?.message });
      }

      return res.status(200).json({ user: result.value });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  changePassword = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { currentPassword, newPassword } = req.body;
      const result = await this.changePasswordUseCase.execute({
        userId,
        currentPassword,
        newPassword
      });

      if (!result.isSuccess) {
        return res.status(400).json({ error: result.error?.message });
      }

      return res.status(200).json({ message: 'Password berhasil diubah' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const result = await this.forgotPasswordUseCase.execute(email);
      // We don't expose if the email exists or not
      return res.status(200).json({ message: 'Instruksi pemulihan telah dikirim ke email.' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;
      const result = await this.resetPasswordUseCase.execute({ token, newPassword });

      if (!result.isSuccess) {
        return res.status(400).json({ error: result.error?.message });
      }

      return res.status(200).json({ message: 'Password berhasil di-reset' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };
}
