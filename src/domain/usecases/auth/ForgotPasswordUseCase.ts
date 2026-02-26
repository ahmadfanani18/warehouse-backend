import { IUserRepository } from '../../repositories/IUserRepository';
import { Result } from '../../errors/Result';
import { injectable, inject } from 'tsyringe';

// Stub implementation for now until email service is set up
@injectable()
export class ForgotPasswordUseCase {
  constructor(
    @inject('IUserRepository') private readonly userRepo: IUserRepository,
  ) {}

  async execute(email: string): Promise<Result<void>> {
    // 1. Check if user exists
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      // Return ok anyway to prevent email enumeration attacks
      return Result.ok(undefined);
    }

    // 2. Generation of reset token should occur here
    // const resetToken = generateUUID();
    // await this.userRepo.update(user.id, { resetToken, resetTokenExpiry: ... })

    // 3. Send email implementation here...
    // await this.emailService.sendResetPasswordLink(user.email, resetToken);

    return Result.ok(undefined);
  }
}
