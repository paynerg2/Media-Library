import { AuthenticatedUser } from '.';

export interface AuthenticationState {
    loggingIn: boolean;
    loggedIn: boolean;
    user: AuthenticatedUser | null;
    error?: Error | undefined;
}
