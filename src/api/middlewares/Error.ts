// import winston from 'winston';

// export default (
//   err: {
//     (
//       error?: any,
//       level?: string | undefined,
//       message?: string | undefined,
//       meta?: any
//     ): void;
//     message?: any;
//   },
//   req: any,
//   res: {
//     status: (arg0: number) => {
//       (): any;
//       new (): any;
//       json: { (arg0: { message: string }): any; new (): any };
//     };
//   },
//   next: any
// ) => {
//   winston.error(err.message, err);
//   return res.status(500).json({ message: 'Internal Server Error' });
// };
