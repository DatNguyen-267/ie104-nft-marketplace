import { AppError } from "../constants";

export function convertWalletError(error: any) {
  switch (error.code.toString()) {
    case "-32002": {
      return new Error(AppError.CONNECT_WALLET_PROCESSING_PLEASE_OPEN_WALLET);
    }
    default: {
      return error;
    }
  }
}
