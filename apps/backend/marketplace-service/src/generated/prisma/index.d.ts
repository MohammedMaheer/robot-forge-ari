
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Dataset
 * 
 */
export type Dataset = $Result.DefaultSelection<Prisma.$DatasetPayload>
/**
 * Model Review
 * 
 */
export type Review = $Result.DefaultSelection<Prisma.$ReviewPayload>
/**
 * Model Purchase
 * 
 */
export type Purchase = $Result.DefaultSelection<Prisma.$PurchasePayload>
/**
 * Model CartItem
 * 
 */
export type CartItem = $Result.DefaultSelection<Prisma.$CartItemPayload>
/**
 * Model ProvenanceEvent
 * 
 */
export type ProvenanceEvent = $Result.DefaultSelection<Prisma.$ProvenanceEventPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Datasets
 * const datasets = await prisma.dataset.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Datasets
   * const datasets = await prisma.dataset.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.dataset`: Exposes CRUD operations for the **Dataset** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Datasets
    * const datasets = await prisma.dataset.findMany()
    * ```
    */
  get dataset(): Prisma.DatasetDelegate<ExtArgs>;

  /**
   * `prisma.review`: Exposes CRUD operations for the **Review** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reviews
    * const reviews = await prisma.review.findMany()
    * ```
    */
  get review(): Prisma.ReviewDelegate<ExtArgs>;

  /**
   * `prisma.purchase`: Exposes CRUD operations for the **Purchase** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Purchases
    * const purchases = await prisma.purchase.findMany()
    * ```
    */
  get purchase(): Prisma.PurchaseDelegate<ExtArgs>;

  /**
   * `prisma.cartItem`: Exposes CRUD operations for the **CartItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CartItems
    * const cartItems = await prisma.cartItem.findMany()
    * ```
    */
  get cartItem(): Prisma.CartItemDelegate<ExtArgs>;

  /**
   * `prisma.provenanceEvent`: Exposes CRUD operations for the **ProvenanceEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProvenanceEvents
    * const provenanceEvents = await prisma.provenanceEvent.findMany()
    * ```
    */
  get provenanceEvent(): Prisma.ProvenanceEventDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Dataset: 'Dataset',
    Review: 'Review',
    Purchase: 'Purchase',
    CartItem: 'CartItem',
    ProvenanceEvent: 'ProvenanceEvent'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "dataset" | "review" | "purchase" | "cartItem" | "provenanceEvent"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Dataset: {
        payload: Prisma.$DatasetPayload<ExtArgs>
        fields: Prisma.DatasetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DatasetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DatasetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DatasetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DatasetPayload>
          }
          findFirst: {
            args: Prisma.DatasetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DatasetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DatasetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DatasetPayload>
          }
          findMany: {
            args: Prisma.DatasetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DatasetPayload>[]
          }
          create: {
            args: Prisma.DatasetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DatasetPayload>
          }
          createMany: {
            args: Prisma.DatasetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DatasetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DatasetPayload>[]
          }
          delete: {
            args: Prisma.DatasetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DatasetPayload>
          }
          update: {
            args: Prisma.DatasetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DatasetPayload>
          }
          deleteMany: {
            args: Prisma.DatasetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DatasetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DatasetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DatasetPayload>
          }
          aggregate: {
            args: Prisma.DatasetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDataset>
          }
          groupBy: {
            args: Prisma.DatasetGroupByArgs<ExtArgs>
            result: $Utils.Optional<DatasetGroupByOutputType>[]
          }
          count: {
            args: Prisma.DatasetCountArgs<ExtArgs>
            result: $Utils.Optional<DatasetCountAggregateOutputType> | number
          }
        }
      }
      Review: {
        payload: Prisma.$ReviewPayload<ExtArgs>
        fields: Prisma.ReviewFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReviewFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReviewFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          findFirst: {
            args: Prisma.ReviewFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReviewFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          findMany: {
            args: Prisma.ReviewFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>[]
          }
          create: {
            args: Prisma.ReviewCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          createMany: {
            args: Prisma.ReviewCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReviewCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>[]
          }
          delete: {
            args: Prisma.ReviewDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          update: {
            args: Prisma.ReviewUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          deleteMany: {
            args: Prisma.ReviewDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReviewUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReviewUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          aggregate: {
            args: Prisma.ReviewAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReview>
          }
          groupBy: {
            args: Prisma.ReviewGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReviewGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReviewCountArgs<ExtArgs>
            result: $Utils.Optional<ReviewCountAggregateOutputType> | number
          }
        }
      }
      Purchase: {
        payload: Prisma.$PurchasePayload<ExtArgs>
        fields: Prisma.PurchaseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PurchaseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PurchaseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload>
          }
          findFirst: {
            args: Prisma.PurchaseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PurchaseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload>
          }
          findMany: {
            args: Prisma.PurchaseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload>[]
          }
          create: {
            args: Prisma.PurchaseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload>
          }
          createMany: {
            args: Prisma.PurchaseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PurchaseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload>[]
          }
          delete: {
            args: Prisma.PurchaseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload>
          }
          update: {
            args: Prisma.PurchaseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload>
          }
          deleteMany: {
            args: Prisma.PurchaseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PurchaseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PurchaseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload>
          }
          aggregate: {
            args: Prisma.PurchaseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePurchase>
          }
          groupBy: {
            args: Prisma.PurchaseGroupByArgs<ExtArgs>
            result: $Utils.Optional<PurchaseGroupByOutputType>[]
          }
          count: {
            args: Prisma.PurchaseCountArgs<ExtArgs>
            result: $Utils.Optional<PurchaseCountAggregateOutputType> | number
          }
        }
      }
      CartItem: {
        payload: Prisma.$CartItemPayload<ExtArgs>
        fields: Prisma.CartItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CartItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CartItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>
          }
          findFirst: {
            args: Prisma.CartItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CartItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>
          }
          findMany: {
            args: Prisma.CartItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>[]
          }
          create: {
            args: Prisma.CartItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>
          }
          createMany: {
            args: Prisma.CartItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CartItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>[]
          }
          delete: {
            args: Prisma.CartItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>
          }
          update: {
            args: Prisma.CartItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>
          }
          deleteMany: {
            args: Prisma.CartItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CartItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CartItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>
          }
          aggregate: {
            args: Prisma.CartItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCartItem>
          }
          groupBy: {
            args: Prisma.CartItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<CartItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.CartItemCountArgs<ExtArgs>
            result: $Utils.Optional<CartItemCountAggregateOutputType> | number
          }
        }
      }
      ProvenanceEvent: {
        payload: Prisma.$ProvenanceEventPayload<ExtArgs>
        fields: Prisma.ProvenanceEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProvenanceEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProvenanceEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProvenanceEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProvenanceEventPayload>
          }
          findFirst: {
            args: Prisma.ProvenanceEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProvenanceEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProvenanceEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProvenanceEventPayload>
          }
          findMany: {
            args: Prisma.ProvenanceEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProvenanceEventPayload>[]
          }
          create: {
            args: Prisma.ProvenanceEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProvenanceEventPayload>
          }
          createMany: {
            args: Prisma.ProvenanceEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProvenanceEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProvenanceEventPayload>[]
          }
          delete: {
            args: Prisma.ProvenanceEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProvenanceEventPayload>
          }
          update: {
            args: Prisma.ProvenanceEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProvenanceEventPayload>
          }
          deleteMany: {
            args: Prisma.ProvenanceEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProvenanceEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProvenanceEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProvenanceEventPayload>
          }
          aggregate: {
            args: Prisma.ProvenanceEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProvenanceEvent>
          }
          groupBy: {
            args: Prisma.ProvenanceEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProvenanceEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProvenanceEventCountArgs<ExtArgs>
            result: $Utils.Optional<ProvenanceEventCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type DatasetCountOutputType
   */

  export type DatasetCountOutputType = {
    reviews: number
    purchases: number
    cartItems: number
    provenance: number
  }

  export type DatasetCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reviews?: boolean | DatasetCountOutputTypeCountReviewsArgs
    purchases?: boolean | DatasetCountOutputTypeCountPurchasesArgs
    cartItems?: boolean | DatasetCountOutputTypeCountCartItemsArgs
    provenance?: boolean | DatasetCountOutputTypeCountProvenanceArgs
  }

  // Custom InputTypes
  /**
   * DatasetCountOutputType without action
   */
  export type DatasetCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DatasetCountOutputType
     */
    select?: DatasetCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DatasetCountOutputType without action
   */
  export type DatasetCountOutputTypeCountReviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReviewWhereInput
  }

  /**
   * DatasetCountOutputType without action
   */
  export type DatasetCountOutputTypeCountPurchasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseWhereInput
  }

  /**
   * DatasetCountOutputType without action
   */
  export type DatasetCountOutputTypeCountCartItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CartItemWhereInput
  }

  /**
   * DatasetCountOutputType without action
   */
  export type DatasetCountOutputTypeCountProvenanceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProvenanceEventWhereInput
  }


  /**
   * Count Type ProvenanceEventCountOutputType
   */

  export type ProvenanceEventCountOutputType = {
    children: number
  }

  export type ProvenanceEventCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    children?: boolean | ProvenanceEventCountOutputTypeCountChildrenArgs
  }

  // Custom InputTypes
  /**
   * ProvenanceEventCountOutputType without action
   */
  export type ProvenanceEventCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvenanceEventCountOutputType
     */
    select?: ProvenanceEventCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProvenanceEventCountOutputType without action
   */
  export type ProvenanceEventCountOutputTypeCountChildrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProvenanceEventWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Dataset
   */

  export type AggregateDataset = {
    _count: DatasetCountAggregateOutputType | null
    _avg: DatasetAvgAggregateOutputType | null
    _sum: DatasetSumAggregateOutputType | null
    _min: DatasetMinAggregateOutputType | null
    _max: DatasetMaxAggregateOutputType | null
  }

  export type DatasetAvgAggregateOutputType = {
    episodeCount: number | null
    totalDurationHours: number | null
    sizeGb: number | null
    qualityScore: number | null
    pricePerEpisode: number | null
    downloads: number | null
    rating: number | null
  }

  export type DatasetSumAggregateOutputType = {
    episodeCount: number | null
    totalDurationHours: number | null
    sizeGb: number | null
    qualityScore: number | null
    pricePerEpisode: number | null
    downloads: number | null
    rating: number | null
  }

  export type DatasetMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    ownerId: string | null
    task: string | null
    episodeCount: number | null
    totalDurationHours: number | null
    sizeGb: number | null
    qualityScore: number | null
    format: string | null
    pricingTier: string | null
    pricePerEpisode: number | null
    downloads: number | null
    rating: number | null
    accessLevel: string | null
    licenseType: string | null
    storageUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DatasetMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    ownerId: string | null
    task: string | null
    episodeCount: number | null
    totalDurationHours: number | null
    sizeGb: number | null
    qualityScore: number | null
    format: string | null
    pricingTier: string | null
    pricePerEpisode: number | null
    downloads: number | null
    rating: number | null
    accessLevel: string | null
    licenseType: string | null
    storageUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DatasetCountAggregateOutputType = {
    id: number
    name: number
    description: number
    ownerId: number
    task: number
    embodiments: number
    episodeCount: number
    totalDurationHours: number
    sizeGb: number
    qualityScore: number
    format: number
    pricingTier: number
    pricePerEpisode: number
    tags: number
    downloads: number
    rating: number
    accessLevel: number
    licenseType: number
    storageUrl: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DatasetAvgAggregateInputType = {
    episodeCount?: true
    totalDurationHours?: true
    sizeGb?: true
    qualityScore?: true
    pricePerEpisode?: true
    downloads?: true
    rating?: true
  }

  export type DatasetSumAggregateInputType = {
    episodeCount?: true
    totalDurationHours?: true
    sizeGb?: true
    qualityScore?: true
    pricePerEpisode?: true
    downloads?: true
    rating?: true
  }

  export type DatasetMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    ownerId?: true
    task?: true
    episodeCount?: true
    totalDurationHours?: true
    sizeGb?: true
    qualityScore?: true
    format?: true
    pricingTier?: true
    pricePerEpisode?: true
    downloads?: true
    rating?: true
    accessLevel?: true
    licenseType?: true
    storageUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DatasetMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    ownerId?: true
    task?: true
    episodeCount?: true
    totalDurationHours?: true
    sizeGb?: true
    qualityScore?: true
    format?: true
    pricingTier?: true
    pricePerEpisode?: true
    downloads?: true
    rating?: true
    accessLevel?: true
    licenseType?: true
    storageUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DatasetCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    ownerId?: true
    task?: true
    embodiments?: true
    episodeCount?: true
    totalDurationHours?: true
    sizeGb?: true
    qualityScore?: true
    format?: true
    pricingTier?: true
    pricePerEpisode?: true
    tags?: true
    downloads?: true
    rating?: true
    accessLevel?: true
    licenseType?: true
    storageUrl?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DatasetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Dataset to aggregate.
     */
    where?: DatasetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Datasets to fetch.
     */
    orderBy?: DatasetOrderByWithRelationInput | DatasetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DatasetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Datasets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Datasets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Datasets
    **/
    _count?: true | DatasetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DatasetAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DatasetSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DatasetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DatasetMaxAggregateInputType
  }

  export type GetDatasetAggregateType<T extends DatasetAggregateArgs> = {
        [P in keyof T & keyof AggregateDataset]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDataset[P]>
      : GetScalarType<T[P], AggregateDataset[P]>
  }




  export type DatasetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DatasetWhereInput
    orderBy?: DatasetOrderByWithAggregationInput | DatasetOrderByWithAggregationInput[]
    by: DatasetScalarFieldEnum[] | DatasetScalarFieldEnum
    having?: DatasetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DatasetCountAggregateInputType | true
    _avg?: DatasetAvgAggregateInputType
    _sum?: DatasetSumAggregateInputType
    _min?: DatasetMinAggregateInputType
    _max?: DatasetMaxAggregateInputType
  }

  export type DatasetGroupByOutputType = {
    id: string
    name: string
    description: string
    ownerId: string
    task: string
    embodiments: string[]
    episodeCount: number
    totalDurationHours: number
    sizeGb: number
    qualityScore: number
    format: string
    pricingTier: string
    pricePerEpisode: number | null
    tags: string[]
    downloads: number
    rating: number
    accessLevel: string
    licenseType: string
    storageUrl: string | null
    createdAt: Date
    updatedAt: Date
    _count: DatasetCountAggregateOutputType | null
    _avg: DatasetAvgAggregateOutputType | null
    _sum: DatasetSumAggregateOutputType | null
    _min: DatasetMinAggregateOutputType | null
    _max: DatasetMaxAggregateOutputType | null
  }

  type GetDatasetGroupByPayload<T extends DatasetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DatasetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DatasetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DatasetGroupByOutputType[P]>
            : GetScalarType<T[P], DatasetGroupByOutputType[P]>
        }
      >
    >


  export type DatasetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    ownerId?: boolean
    task?: boolean
    embodiments?: boolean
    episodeCount?: boolean
    totalDurationHours?: boolean
    sizeGb?: boolean
    qualityScore?: boolean
    format?: boolean
    pricingTier?: boolean
    pricePerEpisode?: boolean
    tags?: boolean
    downloads?: boolean
    rating?: boolean
    accessLevel?: boolean
    licenseType?: boolean
    storageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    reviews?: boolean | Dataset$reviewsArgs<ExtArgs>
    purchases?: boolean | Dataset$purchasesArgs<ExtArgs>
    cartItems?: boolean | Dataset$cartItemsArgs<ExtArgs>
    provenance?: boolean | Dataset$provenanceArgs<ExtArgs>
    _count?: boolean | DatasetCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dataset"]>

  export type DatasetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    ownerId?: boolean
    task?: boolean
    embodiments?: boolean
    episodeCount?: boolean
    totalDurationHours?: boolean
    sizeGb?: boolean
    qualityScore?: boolean
    format?: boolean
    pricingTier?: boolean
    pricePerEpisode?: boolean
    tags?: boolean
    downloads?: boolean
    rating?: boolean
    accessLevel?: boolean
    licenseType?: boolean
    storageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["dataset"]>

  export type DatasetSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    ownerId?: boolean
    task?: boolean
    embodiments?: boolean
    episodeCount?: boolean
    totalDurationHours?: boolean
    sizeGb?: boolean
    qualityScore?: boolean
    format?: boolean
    pricingTier?: boolean
    pricePerEpisode?: boolean
    tags?: boolean
    downloads?: boolean
    rating?: boolean
    accessLevel?: boolean
    licenseType?: boolean
    storageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DatasetInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reviews?: boolean | Dataset$reviewsArgs<ExtArgs>
    purchases?: boolean | Dataset$purchasesArgs<ExtArgs>
    cartItems?: boolean | Dataset$cartItemsArgs<ExtArgs>
    provenance?: boolean | Dataset$provenanceArgs<ExtArgs>
    _count?: boolean | DatasetCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DatasetIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DatasetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Dataset"
    objects: {
      reviews: Prisma.$ReviewPayload<ExtArgs>[]
      purchases: Prisma.$PurchasePayload<ExtArgs>[]
      cartItems: Prisma.$CartItemPayload<ExtArgs>[]
      provenance: Prisma.$ProvenanceEventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string
      ownerId: string
      task: string
      embodiments: string[]
      episodeCount: number
      totalDurationHours: number
      sizeGb: number
      qualityScore: number
      format: string
      pricingTier: string
      pricePerEpisode: number | null
      tags: string[]
      downloads: number
      rating: number
      accessLevel: string
      licenseType: string
      storageUrl: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["dataset"]>
    composites: {}
  }

  type DatasetGetPayload<S extends boolean | null | undefined | DatasetDefaultArgs> = $Result.GetResult<Prisma.$DatasetPayload, S>

  type DatasetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DatasetFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DatasetCountAggregateInputType | true
    }

  export interface DatasetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Dataset'], meta: { name: 'Dataset' } }
    /**
     * Find zero or one Dataset that matches the filter.
     * @param {DatasetFindUniqueArgs} args - Arguments to find a Dataset
     * @example
     * // Get one Dataset
     * const dataset = await prisma.dataset.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DatasetFindUniqueArgs>(args: SelectSubset<T, DatasetFindUniqueArgs<ExtArgs>>): Prisma__DatasetClient<$Result.GetResult<Prisma.$DatasetPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Dataset that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DatasetFindUniqueOrThrowArgs} args - Arguments to find a Dataset
     * @example
     * // Get one Dataset
     * const dataset = await prisma.dataset.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DatasetFindUniqueOrThrowArgs>(args: SelectSubset<T, DatasetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DatasetClient<$Result.GetResult<Prisma.$DatasetPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Dataset that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DatasetFindFirstArgs} args - Arguments to find a Dataset
     * @example
     * // Get one Dataset
     * const dataset = await prisma.dataset.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DatasetFindFirstArgs>(args?: SelectSubset<T, DatasetFindFirstArgs<ExtArgs>>): Prisma__DatasetClient<$Result.GetResult<Prisma.$DatasetPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Dataset that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DatasetFindFirstOrThrowArgs} args - Arguments to find a Dataset
     * @example
     * // Get one Dataset
     * const dataset = await prisma.dataset.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DatasetFindFirstOrThrowArgs>(args?: SelectSubset<T, DatasetFindFirstOrThrowArgs<ExtArgs>>): Prisma__DatasetClient<$Result.GetResult<Prisma.$DatasetPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Datasets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DatasetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Datasets
     * const datasets = await prisma.dataset.findMany()
     * 
     * // Get first 10 Datasets
     * const datasets = await prisma.dataset.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const datasetWithIdOnly = await prisma.dataset.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DatasetFindManyArgs>(args?: SelectSubset<T, DatasetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DatasetPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Dataset.
     * @param {DatasetCreateArgs} args - Arguments to create a Dataset.
     * @example
     * // Create one Dataset
     * const Dataset = await prisma.dataset.create({
     *   data: {
     *     // ... data to create a Dataset
     *   }
     * })
     * 
     */
    create<T extends DatasetCreateArgs>(args: SelectSubset<T, DatasetCreateArgs<ExtArgs>>): Prisma__DatasetClient<$Result.GetResult<Prisma.$DatasetPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Datasets.
     * @param {DatasetCreateManyArgs} args - Arguments to create many Datasets.
     * @example
     * // Create many Datasets
     * const dataset = await prisma.dataset.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DatasetCreateManyArgs>(args?: SelectSubset<T, DatasetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Datasets and returns the data saved in the database.
     * @param {DatasetCreateManyAndReturnArgs} args - Arguments to create many Datasets.
     * @example
     * // Create many Datasets
     * const dataset = await prisma.dataset.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Datasets and only return the `id`
     * const datasetWithIdOnly = await prisma.dataset.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DatasetCreateManyAndReturnArgs>(args?: SelectSubset<T, DatasetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DatasetPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Dataset.
     * @param {DatasetDeleteArgs} args - Arguments to delete one Dataset.
     * @example
     * // Delete one Dataset
     * const Dataset = await prisma.dataset.delete({
     *   where: {
     *     // ... filter to delete one Dataset
     *   }
     * })
     * 
     */
    delete<T extends DatasetDeleteArgs>(args: SelectSubset<T, DatasetDeleteArgs<ExtArgs>>): Prisma__DatasetClient<$Result.GetResult<Prisma.$DatasetPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Dataset.
     * @param {DatasetUpdateArgs} args - Arguments to update one Dataset.
     * @example
     * // Update one Dataset
     * const dataset = await prisma.dataset.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DatasetUpdateArgs>(args: SelectSubset<T, DatasetUpdateArgs<ExtArgs>>): Prisma__DatasetClient<$Result.GetResult<Prisma.$DatasetPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Datasets.
     * @param {DatasetDeleteManyArgs} args - Arguments to filter Datasets to delete.
     * @example
     * // Delete a few Datasets
     * const { count } = await prisma.dataset.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DatasetDeleteManyArgs>(args?: SelectSubset<T, DatasetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Datasets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DatasetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Datasets
     * const dataset = await prisma.dataset.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DatasetUpdateManyArgs>(args: SelectSubset<T, DatasetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Dataset.
     * @param {DatasetUpsertArgs} args - Arguments to update or create a Dataset.
     * @example
     * // Update or create a Dataset
     * const dataset = await prisma.dataset.upsert({
     *   create: {
     *     // ... data to create a Dataset
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Dataset we want to update
     *   }
     * })
     */
    upsert<T extends DatasetUpsertArgs>(args: SelectSubset<T, DatasetUpsertArgs<ExtArgs>>): Prisma__DatasetClient<$Result.GetResult<Prisma.$DatasetPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Datasets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DatasetCountArgs} args - Arguments to filter Datasets to count.
     * @example
     * // Count the number of Datasets
     * const count = await prisma.dataset.count({
     *   where: {
     *     // ... the filter for the Datasets we want to count
     *   }
     * })
    **/
    count<T extends DatasetCountArgs>(
      args?: Subset<T, DatasetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DatasetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Dataset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DatasetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DatasetAggregateArgs>(args: Subset<T, DatasetAggregateArgs>): Prisma.PrismaPromise<GetDatasetAggregateType<T>>

    /**
     * Group by Dataset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DatasetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DatasetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DatasetGroupByArgs['orderBy'] }
        : { orderBy?: DatasetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DatasetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDatasetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Dataset model
   */
  readonly fields: DatasetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Dataset.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DatasetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reviews<T extends Dataset$reviewsArgs<ExtArgs> = {}>(args?: Subset<T, Dataset$reviewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findMany"> | Null>
    purchases<T extends Dataset$purchasesArgs<ExtArgs> = {}>(args?: Subset<T, Dataset$purchasesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "findMany"> | Null>
    cartItems<T extends Dataset$cartItemsArgs<ExtArgs> = {}>(args?: Subset<T, Dataset$cartItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findMany"> | Null>
    provenance<T extends Dataset$provenanceArgs<ExtArgs> = {}>(args?: Subset<T, Dataset$provenanceArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProvenanceEventPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Dataset model
   */ 
  interface DatasetFieldRefs {
    readonly id: FieldRef<"Dataset", 'String'>
    readonly name: FieldRef<"Dataset", 'String'>
    readonly description: FieldRef<"Dataset", 'String'>
    readonly ownerId: FieldRef<"Dataset", 'String'>
    readonly task: FieldRef<"Dataset", 'String'>
    readonly embodiments: FieldRef<"Dataset", 'String[]'>
    readonly episodeCount: FieldRef<"Dataset", 'Int'>
    readonly totalDurationHours: FieldRef<"Dataset", 'Float'>
    readonly sizeGb: FieldRef<"Dataset", 'Float'>
    readonly qualityScore: FieldRef<"Dataset", 'Float'>
    readonly format: FieldRef<"Dataset", 'String'>
    readonly pricingTier: FieldRef<"Dataset", 'String'>
    readonly pricePerEpisode: FieldRef<"Dataset", 'Int'>
    readonly tags: FieldRef<"Dataset", 'String[]'>
    readonly downloads: FieldRef<"Dataset", 'Int'>
    readonly rating: FieldRef<"Dataset", 'Float'>
    readonly accessLevel: FieldRef<"Dataset", 'String'>
    readonly licenseType: FieldRef<"Dataset", 'String'>
    readonly storageUrl: FieldRef<"Dataset", 'String'>
    readonly createdAt: FieldRef<"Dataset", 'DateTime'>
    readonly updatedAt: FieldRef<"Dataset", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Dataset findUnique
   */
  export type DatasetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dataset
     */
    select?: DatasetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DatasetInclude<ExtArgs> | null
    /**
     * Filter, which Dataset to fetch.
     */
    where: DatasetWhereUniqueInput
  }

  /**
   * Dataset findUniqueOrThrow
   */
  export type DatasetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dataset
     */
    select?: DatasetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DatasetInclude<ExtArgs> | null
    /**
     * Filter, which Dataset to fetch.
     */
    where: DatasetWhereUniqueInput
  }

  /**
   * Dataset findFirst
   */
  export type DatasetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dataset
     */
    select?: DatasetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DatasetInclude<ExtArgs> | null
    /**
     * Filter, which Dataset to fetch.
     */
    where?: DatasetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Datasets to fetch.
     */
    orderBy?: DatasetOrderByWithRelationInput | DatasetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Datasets.
     */
    cursor?: DatasetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Datasets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Datasets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Datasets.
     */
    distinct?: DatasetScalarFieldEnum | DatasetScalarFieldEnum[]
  }

  /**
   * Dataset findFirstOrThrow
   */
  export type DatasetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dataset
     */
    select?: DatasetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DatasetInclude<ExtArgs> | null
    /**
     * Filter, which Dataset to fetch.
     */
    where?: DatasetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Datasets to fetch.
     */
    orderBy?: DatasetOrderByWithRelationInput | DatasetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Datasets.
     */
    cursor?: DatasetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Datasets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Datasets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Datasets.
     */
    distinct?: DatasetScalarFieldEnum | DatasetScalarFieldEnum[]
  }

  /**
   * Dataset findMany
   */
  export type DatasetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dataset
     */
    select?: DatasetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DatasetInclude<ExtArgs> | null
    /**
     * Filter, which Datasets to fetch.
     */
    where?: DatasetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Datasets to fetch.
     */
    orderBy?: DatasetOrderByWithRelationInput | DatasetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Datasets.
     */
    cursor?: DatasetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Datasets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Datasets.
     */
    skip?: number
    distinct?: DatasetScalarFieldEnum | DatasetScalarFieldEnum[]
  }

  /**
   * Dataset create
   */
  export type DatasetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dataset
     */
    select?: DatasetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DatasetInclude<ExtArgs> | null
    /**
     * The data needed to create a Dataset.
     */
    data: XOR<DatasetCreateInput, DatasetUncheckedCreateInput>
  }

  /**
   * Dataset createMany
   */
  export type DatasetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Datasets.
     */
    data: DatasetCreateManyInput | DatasetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Dataset createManyAndReturn
   */
  export type DatasetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dataset
     */
    select?: DatasetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Datasets.
     */
    data: DatasetCreateManyInput | DatasetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Dataset update
   */
  export type DatasetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dataset
     */
    select?: DatasetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DatasetInclude<ExtArgs> | null
    /**
     * The data needed to update a Dataset.
     */
    data: XOR<DatasetUpdateInput, DatasetUncheckedUpdateInput>
    /**
     * Choose, which Dataset to update.
     */
    where: DatasetWhereUniqueInput
  }

  /**
   * Dataset updateMany
   */
  export type DatasetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Datasets.
     */
    data: XOR<DatasetUpdateManyMutationInput, DatasetUncheckedUpdateManyInput>
    /**
     * Filter which Datasets to update
     */
    where?: DatasetWhereInput
  }

  /**
   * Dataset upsert
   */
  export type DatasetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dataset
     */
    select?: DatasetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DatasetInclude<ExtArgs> | null
    /**
     * The filter to search for the Dataset to update in case it exists.
     */
    where: DatasetWhereUniqueInput
    /**
     * In case the Dataset found by the `where` argument doesn't exist, create a new Dataset with this data.
     */
    create: XOR<DatasetCreateInput, DatasetUncheckedCreateInput>
    /**
     * In case the Dataset was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DatasetUpdateInput, DatasetUncheckedUpdateInput>
  }

  /**
   * Dataset delete
   */
  export type DatasetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dataset
     */
    select?: DatasetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DatasetInclude<ExtArgs> | null
    /**
     * Filter which Dataset to delete.
     */
    where: DatasetWhereUniqueInput
  }

  /**
   * Dataset deleteMany
   */
  export type DatasetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Datasets to delete
     */
    where?: DatasetWhereInput
  }

  /**
   * Dataset.reviews
   */
  export type Dataset$reviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    where?: ReviewWhereInput
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    cursor?: ReviewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Dataset.purchases
   */
  export type Dataset$purchasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    where?: PurchaseWhereInput
    orderBy?: PurchaseOrderByWithRelationInput | PurchaseOrderByWithRelationInput[]
    cursor?: PurchaseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PurchaseScalarFieldEnum | PurchaseScalarFieldEnum[]
  }

  /**
   * Dataset.cartItems
   */
  export type Dataset$cartItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    where?: CartItemWhereInput
    orderBy?: CartItemOrderByWithRelationInput | CartItemOrderByWithRelationInput[]
    cursor?: CartItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CartItemScalarFieldEnum | CartItemScalarFieldEnum[]
  }

  /**
   * Dataset.provenance
   */
  export type Dataset$provenanceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvenanceEvent
     */
    select?: ProvenanceEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvenanceEventInclude<ExtArgs> | null
    where?: ProvenanceEventWhereInput
    orderBy?: ProvenanceEventOrderByWithRelationInput | ProvenanceEventOrderByWithRelationInput[]
    cursor?: ProvenanceEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProvenanceEventScalarFieldEnum | ProvenanceEventScalarFieldEnum[]
  }

  /**
   * Dataset without action
   */
  export type DatasetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dataset
     */
    select?: DatasetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DatasetInclude<ExtArgs> | null
  }


  /**
   * Model Review
   */

  export type AggregateReview = {
    _count: ReviewCountAggregateOutputType | null
    _avg: ReviewAvgAggregateOutputType | null
    _sum: ReviewSumAggregateOutputType | null
    _min: ReviewMinAggregateOutputType | null
    _max: ReviewMaxAggregateOutputType | null
  }

  export type ReviewAvgAggregateOutputType = {
    rating: number | null
  }

  export type ReviewSumAggregateOutputType = {
    rating: number | null
  }

  export type ReviewMinAggregateOutputType = {
    id: string | null
    datasetId: string | null
    userId: string | null
    userName: string | null
    rating: number | null
    comment: string | null
    createdAt: Date | null
  }

  export type ReviewMaxAggregateOutputType = {
    id: string | null
    datasetId: string | null
    userId: string | null
    userName: string | null
    rating: number | null
    comment: string | null
    createdAt: Date | null
  }

  export type ReviewCountAggregateOutputType = {
    id: number
    datasetId: number
    userId: number
    userName: number
    rating: number
    comment: number
    createdAt: number
    _all: number
  }


  export type ReviewAvgAggregateInputType = {
    rating?: true
  }

  export type ReviewSumAggregateInputType = {
    rating?: true
  }

  export type ReviewMinAggregateInputType = {
    id?: true
    datasetId?: true
    userId?: true
    userName?: true
    rating?: true
    comment?: true
    createdAt?: true
  }

  export type ReviewMaxAggregateInputType = {
    id?: true
    datasetId?: true
    userId?: true
    userName?: true
    rating?: true
    comment?: true
    createdAt?: true
  }

  export type ReviewCountAggregateInputType = {
    id?: true
    datasetId?: true
    userId?: true
    userName?: true
    rating?: true
    comment?: true
    createdAt?: true
    _all?: true
  }

  export type ReviewAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Review to aggregate.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reviews
    **/
    _count?: true | ReviewCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReviewAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReviewSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReviewMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReviewMaxAggregateInputType
  }

  export type GetReviewAggregateType<T extends ReviewAggregateArgs> = {
        [P in keyof T & keyof AggregateReview]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReview[P]>
      : GetScalarType<T[P], AggregateReview[P]>
  }




  export type ReviewGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReviewWhereInput
    orderBy?: ReviewOrderByWithAggregationInput | ReviewOrderByWithAggregationInput[]
    by: ReviewScalarFieldEnum[] | ReviewScalarFieldEnum
    having?: ReviewScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReviewCountAggregateInputType | true
    _avg?: ReviewAvgAggregateInputType
    _sum?: ReviewSumAggregateInputType
    _min?: ReviewMinAggregateInputType
    _max?: ReviewMaxAggregateInputType
  }

  export type ReviewGroupByOutputType = {
    id: string
    datasetId: string
    userId: string
    userName: string
    rating: number
    comment: string
    createdAt: Date
    _count: ReviewCountAggregateOutputType | null
    _avg: ReviewAvgAggregateOutputType | null
    _sum: ReviewSumAggregateOutputType | null
    _min: ReviewMinAggregateOutputType | null
    _max: ReviewMaxAggregateOutputType | null
  }

  type GetReviewGroupByPayload<T extends ReviewGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReviewGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReviewGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReviewGroupByOutputType[P]>
            : GetScalarType<T[P], ReviewGroupByOutputType[P]>
        }
      >
    >


  export type ReviewSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    datasetId?: boolean
    userId?: boolean
    userName?: boolean
    rating?: boolean
    comment?: boolean
    createdAt?: boolean
    dataset?: boolean | DatasetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["review"]>

  export type ReviewSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    datasetId?: boolean
    userId?: boolean
    userName?: boolean
    rating?: boolean
    comment?: boolean
    createdAt?: boolean
    dataset?: boolean | DatasetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["review"]>

  export type ReviewSelectScalar = {
    id?: boolean
    datasetId?: boolean
    userId?: boolean
    userName?: boolean
    rating?: boolean
    comment?: boolean
    createdAt?: boolean
  }

  export type ReviewInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dataset?: boolean | DatasetDefaultArgs<ExtArgs>
  }
  export type ReviewIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dataset?: boolean | DatasetDefaultArgs<ExtArgs>
  }

  export type $ReviewPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Review"
    objects: {
      dataset: Prisma.$DatasetPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      datasetId: string
      userId: string
      userName: string
      rating: number
      comment: string
      createdAt: Date
    }, ExtArgs["result"]["review"]>
    composites: {}
  }

  type ReviewGetPayload<S extends boolean | null | undefined | ReviewDefaultArgs> = $Result.GetResult<Prisma.$ReviewPayload, S>

  type ReviewCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ReviewFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ReviewCountAggregateInputType | true
    }

  export interface ReviewDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Review'], meta: { name: 'Review' } }
    /**
     * Find zero or one Review that matches the filter.
     * @param {ReviewFindUniqueArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReviewFindUniqueArgs>(args: SelectSubset<T, ReviewFindUniqueArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Review that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ReviewFindUniqueOrThrowArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReviewFindUniqueOrThrowArgs>(args: SelectSubset<T, ReviewFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Review that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewFindFirstArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReviewFindFirstArgs>(args?: SelectSubset<T, ReviewFindFirstArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Review that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewFindFirstOrThrowArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReviewFindFirstOrThrowArgs>(args?: SelectSubset<T, ReviewFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Reviews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reviews
     * const reviews = await prisma.review.findMany()
     * 
     * // Get first 10 Reviews
     * const reviews = await prisma.review.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reviewWithIdOnly = await prisma.review.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReviewFindManyArgs>(args?: SelectSubset<T, ReviewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Review.
     * @param {ReviewCreateArgs} args - Arguments to create a Review.
     * @example
     * // Create one Review
     * const Review = await prisma.review.create({
     *   data: {
     *     // ... data to create a Review
     *   }
     * })
     * 
     */
    create<T extends ReviewCreateArgs>(args: SelectSubset<T, ReviewCreateArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Reviews.
     * @param {ReviewCreateManyArgs} args - Arguments to create many Reviews.
     * @example
     * // Create many Reviews
     * const review = await prisma.review.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReviewCreateManyArgs>(args?: SelectSubset<T, ReviewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reviews and returns the data saved in the database.
     * @param {ReviewCreateManyAndReturnArgs} args - Arguments to create many Reviews.
     * @example
     * // Create many Reviews
     * const review = await prisma.review.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reviews and only return the `id`
     * const reviewWithIdOnly = await prisma.review.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReviewCreateManyAndReturnArgs>(args?: SelectSubset<T, ReviewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Review.
     * @param {ReviewDeleteArgs} args - Arguments to delete one Review.
     * @example
     * // Delete one Review
     * const Review = await prisma.review.delete({
     *   where: {
     *     // ... filter to delete one Review
     *   }
     * })
     * 
     */
    delete<T extends ReviewDeleteArgs>(args: SelectSubset<T, ReviewDeleteArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Review.
     * @param {ReviewUpdateArgs} args - Arguments to update one Review.
     * @example
     * // Update one Review
     * const review = await prisma.review.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReviewUpdateArgs>(args: SelectSubset<T, ReviewUpdateArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Reviews.
     * @param {ReviewDeleteManyArgs} args - Arguments to filter Reviews to delete.
     * @example
     * // Delete a few Reviews
     * const { count } = await prisma.review.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReviewDeleteManyArgs>(args?: SelectSubset<T, ReviewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reviews
     * const review = await prisma.review.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReviewUpdateManyArgs>(args: SelectSubset<T, ReviewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Review.
     * @param {ReviewUpsertArgs} args - Arguments to update or create a Review.
     * @example
     * // Update or create a Review
     * const review = await prisma.review.upsert({
     *   create: {
     *     // ... data to create a Review
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Review we want to update
     *   }
     * })
     */
    upsert<T extends ReviewUpsertArgs>(args: SelectSubset<T, ReviewUpsertArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Reviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewCountArgs} args - Arguments to filter Reviews to count.
     * @example
     * // Count the number of Reviews
     * const count = await prisma.review.count({
     *   where: {
     *     // ... the filter for the Reviews we want to count
     *   }
     * })
    **/
    count<T extends ReviewCountArgs>(
      args?: Subset<T, ReviewCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReviewCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Review.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReviewAggregateArgs>(args: Subset<T, ReviewAggregateArgs>): Prisma.PrismaPromise<GetReviewAggregateType<T>>

    /**
     * Group by Review.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReviewGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReviewGroupByArgs['orderBy'] }
        : { orderBy?: ReviewGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReviewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReviewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Review model
   */
  readonly fields: ReviewFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Review.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReviewClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dataset<T extends DatasetDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DatasetDefaultArgs<ExtArgs>>): Prisma__DatasetClient<$Result.GetResult<Prisma.$DatasetPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Review model
   */ 
  interface ReviewFieldRefs {
    readonly id: FieldRef<"Review", 'String'>
    readonly datasetId: FieldRef<"Review", 'String'>
    readonly userId: FieldRef<"Review", 'String'>
    readonly userName: FieldRef<"Review", 'String'>
    readonly rating: FieldRef<"Review", 'Int'>
    readonly comment: FieldRef<"Review", 'String'>
    readonly createdAt: FieldRef<"Review", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Review findUnique
   */
  export type ReviewFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review findUniqueOrThrow
   */
  export type ReviewFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review findFirst
   */
  export type ReviewFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reviews.
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reviews.
     */
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Review findFirstOrThrow
   */
  export type ReviewFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reviews.
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reviews.
     */
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Review findMany
   */
  export type ReviewFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter, which Reviews to fetch.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reviews.
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Review create
   */
  export type ReviewCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * The data needed to create a Review.
     */
    data: XOR<ReviewCreateInput, ReviewUncheckedCreateInput>
  }

  /**
   * Review createMany
   */
  export type ReviewCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reviews.
     */
    data: ReviewCreateManyInput | ReviewCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Review createManyAndReturn
   */
  export type ReviewCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Reviews.
     */
    data: ReviewCreateManyInput | ReviewCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Review update
   */
  export type ReviewUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * The data needed to update a Review.
     */
    data: XOR<ReviewUpdateInput, ReviewUncheckedUpdateInput>
    /**
     * Choose, which Review to update.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review updateMany
   */
  export type ReviewUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reviews.
     */
    data: XOR<ReviewUpdateManyMutationInput, ReviewUncheckedUpdateManyInput>
    /**
     * Filter which Reviews to update
     */
    where?: ReviewWhereInput
  }

  /**
   * Review upsert
   */
  export type ReviewUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * The filter to search for the Review to update in case it exists.
     */
    where: ReviewWhereUniqueInput
    /**
     * In case the Review found by the `where` argument doesn't exist, create a new Review with this data.
     */
    create: XOR<ReviewCreateInput, ReviewUncheckedCreateInput>
    /**
     * In case the Review was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReviewUpdateInput, ReviewUncheckedUpdateInput>
  }

  /**
   * Review delete
   */
  export type ReviewDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter which Review to delete.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review deleteMany
   */
  export type ReviewDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reviews to delete
     */
    where?: ReviewWhereInput
  }

  /**
   * Review without action
   */
  export type ReviewDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
  }


  /**
   * Model Purchase
   */

  export type AggregatePurchase = {
    _count: PurchaseCountAggregateOutputType | null
    _avg: PurchaseAvgAggregateOutputType | null
    _sum: PurchaseSumAggregateOutputType | null
    _min: PurchaseMinAggregateOutputType | null
    _max: PurchaseMaxAggregateOutputType | null
  }

  export type PurchaseAvgAggregateOutputType = {
    amount: number | null
  }

  export type PurchaseSumAggregateOutputType = {
    amount: number | null
  }

  export type PurchaseMinAggregateOutputType = {
    id: string | null
    userId: string | null
    datasetId: string | null
    amount: number | null
    currency: string | null
    stripePaymentId: string | null
    status: string | null
    createdAt: Date | null
  }

  export type PurchaseMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    datasetId: string | null
    amount: number | null
    currency: string | null
    stripePaymentId: string | null
    status: string | null
    createdAt: Date | null
  }

  export type PurchaseCountAggregateOutputType = {
    id: number
    userId: number
    datasetId: number
    amount: number
    currency: number
    stripePaymentId: number
    status: number
    createdAt: number
    _all: number
  }


  export type PurchaseAvgAggregateInputType = {
    amount?: true
  }

  export type PurchaseSumAggregateInputType = {
    amount?: true
  }

  export type PurchaseMinAggregateInputType = {
    id?: true
    userId?: true
    datasetId?: true
    amount?: true
    currency?: true
    stripePaymentId?: true
    status?: true
    createdAt?: true
  }

  export type PurchaseMaxAggregateInputType = {
    id?: true
    userId?: true
    datasetId?: true
    amount?: true
    currency?: true
    stripePaymentId?: true
    status?: true
    createdAt?: true
  }

  export type PurchaseCountAggregateInputType = {
    id?: true
    userId?: true
    datasetId?: true
    amount?: true
    currency?: true
    stripePaymentId?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type PurchaseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Purchase to aggregate.
     */
    where?: PurchaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Purchases to fetch.
     */
    orderBy?: PurchaseOrderByWithRelationInput | PurchaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PurchaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Purchases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Purchases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Purchases
    **/
    _count?: true | PurchaseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PurchaseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PurchaseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PurchaseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PurchaseMaxAggregateInputType
  }

  export type GetPurchaseAggregateType<T extends PurchaseAggregateArgs> = {
        [P in keyof T & keyof AggregatePurchase]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePurchase[P]>
      : GetScalarType<T[P], AggregatePurchase[P]>
  }




  export type PurchaseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseWhereInput
    orderBy?: PurchaseOrderByWithAggregationInput | PurchaseOrderByWithAggregationInput[]
    by: PurchaseScalarFieldEnum[] | PurchaseScalarFieldEnum
    having?: PurchaseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PurchaseCountAggregateInputType | true
    _avg?: PurchaseAvgAggregateInputType
    _sum?: PurchaseSumAggregateInputType
    _min?: PurchaseMinAggregateInputType
    _max?: PurchaseMaxAggregateInputType
  }

  export type PurchaseGroupByOutputType = {
    id: string
    userId: string
    datasetId: string
    amount: number
    currency: string
    stripePaymentId: string | null
    status: string
    createdAt: Date
    _count: PurchaseCountAggregateOutputType | null
    _avg: PurchaseAvgAggregateOutputType | null
    _sum: PurchaseSumAggregateOutputType | null
    _min: PurchaseMinAggregateOutputType | null
    _max: PurchaseMaxAggregateOutputType | null
  }

  type GetPurchaseGroupByPayload<T extends PurchaseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PurchaseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PurchaseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PurchaseGroupByOutputType[P]>
            : GetScalarType<T[P], PurchaseGroupByOutputType[P]>
        }
      >
    >


  export type PurchaseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    datasetId?: boolean
    amount?: boolean
    currency?: boolean
    stripePaymentId?: boolean
    status?: boolean
    createdAt?: boolean
    dataset?: boolean | DatasetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["purchase"]>

  export type PurchaseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    datasetId?: boolean
    amount?: boolean
    currency?: boolean
    stripePaymentId?: boolean
    status?: boolean
    createdAt?: boolean
    dataset?: boolean | DatasetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["purchase"]>

  export type PurchaseSelectScalar = {
    id?: boolean
    userId?: boolean
    datasetId?: boolean
    amount?: boolean
    currency?: boolean
    stripePaymentId?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type PurchaseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dataset?: boolean | DatasetDefaultArgs<ExtArgs>
  }
  export type PurchaseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dataset?: boolean | DatasetDefaultArgs<ExtArgs>
  }

  export type $PurchasePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Purchase"
    objects: {
      dataset: Prisma.$DatasetPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      datasetId: string
      amount: number
      currency: string
      stripePaymentId: string | null
      status: string
      createdAt: Date
    }, ExtArgs["result"]["purchase"]>
    composites: {}
  }

  type PurchaseGetPayload<S extends boolean | null | undefined | PurchaseDefaultArgs> = $Result.GetResult<Prisma.$PurchasePayload, S>

  type PurchaseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PurchaseFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PurchaseCountAggregateInputType | true
    }

  export interface PurchaseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Purchase'], meta: { name: 'Purchase' } }
    /**
     * Find zero or one Purchase that matches the filter.
     * @param {PurchaseFindUniqueArgs} args - Arguments to find a Purchase
     * @example
     * // Get one Purchase
     * const purchase = await prisma.purchase.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PurchaseFindUniqueArgs>(args: SelectSubset<T, PurchaseFindUniqueArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Purchase that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PurchaseFindUniqueOrThrowArgs} args - Arguments to find a Purchase
     * @example
     * // Get one Purchase
     * const purchase = await prisma.purchase.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PurchaseFindUniqueOrThrowArgs>(args: SelectSubset<T, PurchaseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Purchase that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseFindFirstArgs} args - Arguments to find a Purchase
     * @example
     * // Get one Purchase
     * const purchase = await prisma.purchase.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PurchaseFindFirstArgs>(args?: SelectSubset<T, PurchaseFindFirstArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Purchase that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseFindFirstOrThrowArgs} args - Arguments to find a Purchase
     * @example
     * // Get one Purchase
     * const purchase = await prisma.purchase.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PurchaseFindFirstOrThrowArgs>(args?: SelectSubset<T, PurchaseFindFirstOrThrowArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Purchases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Purchases
     * const purchases = await prisma.purchase.findMany()
     * 
     * // Get first 10 Purchases
     * const purchases = await prisma.purchase.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const purchaseWithIdOnly = await prisma.purchase.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PurchaseFindManyArgs>(args?: SelectSubset<T, PurchaseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Purchase.
     * @param {PurchaseCreateArgs} args - Arguments to create a Purchase.
     * @example
     * // Create one Purchase
     * const Purchase = await prisma.purchase.create({
     *   data: {
     *     // ... data to create a Purchase
     *   }
     * })
     * 
     */
    create<T extends PurchaseCreateArgs>(args: SelectSubset<T, PurchaseCreateArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Purchases.
     * @param {PurchaseCreateManyArgs} args - Arguments to create many Purchases.
     * @example
     * // Create many Purchases
     * const purchase = await prisma.purchase.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PurchaseCreateManyArgs>(args?: SelectSubset<T, PurchaseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Purchases and returns the data saved in the database.
     * @param {PurchaseCreateManyAndReturnArgs} args - Arguments to create many Purchases.
     * @example
     * // Create many Purchases
     * const purchase = await prisma.purchase.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Purchases and only return the `id`
     * const purchaseWithIdOnly = await prisma.purchase.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PurchaseCreateManyAndReturnArgs>(args?: SelectSubset<T, PurchaseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Purchase.
     * @param {PurchaseDeleteArgs} args - Arguments to delete one Purchase.
     * @example
     * // Delete one Purchase
     * const Purchase = await prisma.purchase.delete({
     *   where: {
     *     // ... filter to delete one Purchase
     *   }
     * })
     * 
     */
    delete<T extends PurchaseDeleteArgs>(args: SelectSubset<T, PurchaseDeleteArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Purchase.
     * @param {PurchaseUpdateArgs} args - Arguments to update one Purchase.
     * @example
     * // Update one Purchase
     * const purchase = await prisma.purchase.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PurchaseUpdateArgs>(args: SelectSubset<T, PurchaseUpdateArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Purchases.
     * @param {PurchaseDeleteManyArgs} args - Arguments to filter Purchases to delete.
     * @example
     * // Delete a few Purchases
     * const { count } = await prisma.purchase.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PurchaseDeleteManyArgs>(args?: SelectSubset<T, PurchaseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Purchases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Purchases
     * const purchase = await prisma.purchase.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PurchaseUpdateManyArgs>(args: SelectSubset<T, PurchaseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Purchase.
     * @param {PurchaseUpsertArgs} args - Arguments to update or create a Purchase.
     * @example
     * // Update or create a Purchase
     * const purchase = await prisma.purchase.upsert({
     *   create: {
     *     // ... data to create a Purchase
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Purchase we want to update
     *   }
     * })
     */
    upsert<T extends PurchaseUpsertArgs>(args: SelectSubset<T, PurchaseUpsertArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Purchases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseCountArgs} args - Arguments to filter Purchases to count.
     * @example
     * // Count the number of Purchases
     * const count = await prisma.purchase.count({
     *   where: {
     *     // ... the filter for the Purchases we want to count
     *   }
     * })
    **/
    count<T extends PurchaseCountArgs>(
      args?: Subset<T, PurchaseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PurchaseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Purchase.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PurchaseAggregateArgs>(args: Subset<T, PurchaseAggregateArgs>): Prisma.PrismaPromise<GetPurchaseAggregateType<T>>

    /**
     * Group by Purchase.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PurchaseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PurchaseGroupByArgs['orderBy'] }
        : { orderBy?: PurchaseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PurchaseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPurchaseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Purchase model
   */
  readonly fields: PurchaseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Purchase.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PurchaseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dataset<T extends DatasetDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DatasetDefaultArgs<ExtArgs>>): Prisma__DatasetClient<$Result.GetResult<Prisma.$DatasetPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Purchase model
   */ 
  interface PurchaseFieldRefs {
    readonly id: FieldRef<"Purchase", 'String'>
    readonly userId: FieldRef<"Purchase", 'String'>
    readonly datasetId: FieldRef<"Purchase", 'String'>
    readonly amount: FieldRef<"Purchase", 'Int'>
    readonly currency: FieldRef<"Purchase", 'String'>
    readonly stripePaymentId: FieldRef<"Purchase", 'String'>
    readonly status: FieldRef<"Purchase", 'String'>
    readonly createdAt: FieldRef<"Purchase", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Purchase findUnique
   */
  export type PurchaseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * Filter, which Purchase to fetch.
     */
    where: PurchaseWhereUniqueInput
  }

  /**
   * Purchase findUniqueOrThrow
   */
  export type PurchaseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * Filter, which Purchase to fetch.
     */
    where: PurchaseWhereUniqueInput
  }

  /**
   * Purchase findFirst
   */
  export type PurchaseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * Filter, which Purchase to fetch.
     */
    where?: PurchaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Purchases to fetch.
     */
    orderBy?: PurchaseOrderByWithRelationInput | PurchaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Purchases.
     */
    cursor?: PurchaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Purchases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Purchases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Purchases.
     */
    distinct?: PurchaseScalarFieldEnum | PurchaseScalarFieldEnum[]
  }

  /**
   * Purchase findFirstOrThrow
   */
  export type PurchaseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * Filter, which Purchase to fetch.
     */
    where?: PurchaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Purchases to fetch.
     */
    orderBy?: PurchaseOrderByWithRelationInput | PurchaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Purchases.
     */
    cursor?: PurchaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Purchases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Purchases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Purchases.
     */
    distinct?: PurchaseScalarFieldEnum | PurchaseScalarFieldEnum[]
  }

  /**
   * Purchase findMany
   */
  export type PurchaseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * Filter, which Purchases to fetch.
     */
    where?: PurchaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Purchases to fetch.
     */
    orderBy?: PurchaseOrderByWithRelationInput | PurchaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Purchases.
     */
    cursor?: PurchaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Purchases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Purchases.
     */
    skip?: number
    distinct?: PurchaseScalarFieldEnum | PurchaseScalarFieldEnum[]
  }

  /**
   * Purchase create
   */
  export type PurchaseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * The data needed to create a Purchase.
     */
    data: XOR<PurchaseCreateInput, PurchaseUncheckedCreateInput>
  }

  /**
   * Purchase createMany
   */
  export type PurchaseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Purchases.
     */
    data: PurchaseCreateManyInput | PurchaseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Purchase createManyAndReturn
   */
  export type PurchaseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Purchases.
     */
    data: PurchaseCreateManyInput | PurchaseCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Purchase update
   */
  export type PurchaseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * The data needed to update a Purchase.
     */
    data: XOR<PurchaseUpdateInput, PurchaseUncheckedUpdateInput>
    /**
     * Choose, which Purchase to update.
     */
    where: PurchaseWhereUniqueInput
  }

  /**
   * Purchase updateMany
   */
  export type PurchaseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Purchases.
     */
    data: XOR<PurchaseUpdateManyMutationInput, PurchaseUncheckedUpdateManyInput>
    /**
     * Filter which Purchases to update
     */
    where?: PurchaseWhereInput
  }

  /**
   * Purchase upsert
   */
  export type PurchaseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * The filter to search for the Purchase to update in case it exists.
     */
    where: PurchaseWhereUniqueInput
    /**
     * In case the Purchase found by the `where` argument doesn't exist, create a new Purchase with this data.
     */
    create: XOR<PurchaseCreateInput, PurchaseUncheckedCreateInput>
    /**
     * In case the Purchase was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PurchaseUpdateInput, PurchaseUncheckedUpdateInput>
  }

  /**
   * Purchase delete
   */
  export type PurchaseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * Filter which Purchase to delete.
     */
    where: PurchaseWhereUniqueInput
  }

  /**
   * Purchase deleteMany
   */
  export type PurchaseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Purchases to delete
     */
    where?: PurchaseWhereInput
  }

  /**
   * Purchase without action
   */
  export type PurchaseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
  }


  /**
   * Model CartItem
   */

  export type AggregateCartItem = {
    _count: CartItemCountAggregateOutputType | null
    _min: CartItemMinAggregateOutputType | null
    _max: CartItemMaxAggregateOutputType | null
  }

  export type CartItemMinAggregateOutputType = {
    id: string | null
    userId: string | null
    datasetId: string | null
    addedAt: Date | null
  }

  export type CartItemMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    datasetId: string | null
    addedAt: Date | null
  }

  export type CartItemCountAggregateOutputType = {
    id: number
    userId: number
    datasetId: number
    addedAt: number
    _all: number
  }


  export type CartItemMinAggregateInputType = {
    id?: true
    userId?: true
    datasetId?: true
    addedAt?: true
  }

  export type CartItemMaxAggregateInputType = {
    id?: true
    userId?: true
    datasetId?: true
    addedAt?: true
  }

  export type CartItemCountAggregateInputType = {
    id?: true
    userId?: true
    datasetId?: true
    addedAt?: true
    _all?: true
  }

  export type CartItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CartItem to aggregate.
     */
    where?: CartItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CartItems to fetch.
     */
    orderBy?: CartItemOrderByWithRelationInput | CartItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CartItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CartItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CartItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CartItems
    **/
    _count?: true | CartItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CartItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CartItemMaxAggregateInputType
  }

  export type GetCartItemAggregateType<T extends CartItemAggregateArgs> = {
        [P in keyof T & keyof AggregateCartItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCartItem[P]>
      : GetScalarType<T[P], AggregateCartItem[P]>
  }




  export type CartItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CartItemWhereInput
    orderBy?: CartItemOrderByWithAggregationInput | CartItemOrderByWithAggregationInput[]
    by: CartItemScalarFieldEnum[] | CartItemScalarFieldEnum
    having?: CartItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CartItemCountAggregateInputType | true
    _min?: CartItemMinAggregateInputType
    _max?: CartItemMaxAggregateInputType
  }

  export type CartItemGroupByOutputType = {
    id: string
    userId: string
    datasetId: string
    addedAt: Date
    _count: CartItemCountAggregateOutputType | null
    _min: CartItemMinAggregateOutputType | null
    _max: CartItemMaxAggregateOutputType | null
  }

  type GetCartItemGroupByPayload<T extends CartItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CartItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CartItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CartItemGroupByOutputType[P]>
            : GetScalarType<T[P], CartItemGroupByOutputType[P]>
        }
      >
    >


  export type CartItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    datasetId?: boolean
    addedAt?: boolean
    dataset?: boolean | DatasetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cartItem"]>

  export type CartItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    datasetId?: boolean
    addedAt?: boolean
    dataset?: boolean | DatasetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cartItem"]>

  export type CartItemSelectScalar = {
    id?: boolean
    userId?: boolean
    datasetId?: boolean
    addedAt?: boolean
  }

  export type CartItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dataset?: boolean | DatasetDefaultArgs<ExtArgs>
  }
  export type CartItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dataset?: boolean | DatasetDefaultArgs<ExtArgs>
  }

  export type $CartItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CartItem"
    objects: {
      dataset: Prisma.$DatasetPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      datasetId: string
      addedAt: Date
    }, ExtArgs["result"]["cartItem"]>
    composites: {}
  }

  type CartItemGetPayload<S extends boolean | null | undefined | CartItemDefaultArgs> = $Result.GetResult<Prisma.$CartItemPayload, S>

  type CartItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CartItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CartItemCountAggregateInputType | true
    }

  export interface CartItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CartItem'], meta: { name: 'CartItem' } }
    /**
     * Find zero or one CartItem that matches the filter.
     * @param {CartItemFindUniqueArgs} args - Arguments to find a CartItem
     * @example
     * // Get one CartItem
     * const cartItem = await prisma.cartItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CartItemFindUniqueArgs>(args: SelectSubset<T, CartItemFindUniqueArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CartItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CartItemFindUniqueOrThrowArgs} args - Arguments to find a CartItem
     * @example
     * // Get one CartItem
     * const cartItem = await prisma.cartItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CartItemFindUniqueOrThrowArgs>(args: SelectSubset<T, CartItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CartItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemFindFirstArgs} args - Arguments to find a CartItem
     * @example
     * // Get one CartItem
     * const cartItem = await prisma.cartItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CartItemFindFirstArgs>(args?: SelectSubset<T, CartItemFindFirstArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CartItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemFindFirstOrThrowArgs} args - Arguments to find a CartItem
     * @example
     * // Get one CartItem
     * const cartItem = await prisma.cartItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CartItemFindFirstOrThrowArgs>(args?: SelectSubset<T, CartItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CartItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CartItems
     * const cartItems = await prisma.cartItem.findMany()
     * 
     * // Get first 10 CartItems
     * const cartItems = await prisma.cartItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cartItemWithIdOnly = await prisma.cartItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CartItemFindManyArgs>(args?: SelectSubset<T, CartItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CartItem.
     * @param {CartItemCreateArgs} args - Arguments to create a CartItem.
     * @example
     * // Create one CartItem
     * const CartItem = await prisma.cartItem.create({
     *   data: {
     *     // ... data to create a CartItem
     *   }
     * })
     * 
     */
    create<T extends CartItemCreateArgs>(args: SelectSubset<T, CartItemCreateArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CartItems.
     * @param {CartItemCreateManyArgs} args - Arguments to create many CartItems.
     * @example
     * // Create many CartItems
     * const cartItem = await prisma.cartItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CartItemCreateManyArgs>(args?: SelectSubset<T, CartItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CartItems and returns the data saved in the database.
     * @param {CartItemCreateManyAndReturnArgs} args - Arguments to create many CartItems.
     * @example
     * // Create many CartItems
     * const cartItem = await prisma.cartItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CartItems and only return the `id`
     * const cartItemWithIdOnly = await prisma.cartItem.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CartItemCreateManyAndReturnArgs>(args?: SelectSubset<T, CartItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CartItem.
     * @param {CartItemDeleteArgs} args - Arguments to delete one CartItem.
     * @example
     * // Delete one CartItem
     * const CartItem = await prisma.cartItem.delete({
     *   where: {
     *     // ... filter to delete one CartItem
     *   }
     * })
     * 
     */
    delete<T extends CartItemDeleteArgs>(args: SelectSubset<T, CartItemDeleteArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CartItem.
     * @param {CartItemUpdateArgs} args - Arguments to update one CartItem.
     * @example
     * // Update one CartItem
     * const cartItem = await prisma.cartItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CartItemUpdateArgs>(args: SelectSubset<T, CartItemUpdateArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CartItems.
     * @param {CartItemDeleteManyArgs} args - Arguments to filter CartItems to delete.
     * @example
     * // Delete a few CartItems
     * const { count } = await prisma.cartItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CartItemDeleteManyArgs>(args?: SelectSubset<T, CartItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CartItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CartItems
     * const cartItem = await prisma.cartItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CartItemUpdateManyArgs>(args: SelectSubset<T, CartItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CartItem.
     * @param {CartItemUpsertArgs} args - Arguments to update or create a CartItem.
     * @example
     * // Update or create a CartItem
     * const cartItem = await prisma.cartItem.upsert({
     *   create: {
     *     // ... data to create a CartItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CartItem we want to update
     *   }
     * })
     */
    upsert<T extends CartItemUpsertArgs>(args: SelectSubset<T, CartItemUpsertArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CartItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemCountArgs} args - Arguments to filter CartItems to count.
     * @example
     * // Count the number of CartItems
     * const count = await prisma.cartItem.count({
     *   where: {
     *     // ... the filter for the CartItems we want to count
     *   }
     * })
    **/
    count<T extends CartItemCountArgs>(
      args?: Subset<T, CartItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CartItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CartItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CartItemAggregateArgs>(args: Subset<T, CartItemAggregateArgs>): Prisma.PrismaPromise<GetCartItemAggregateType<T>>

    /**
     * Group by CartItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CartItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CartItemGroupByArgs['orderBy'] }
        : { orderBy?: CartItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CartItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCartItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CartItem model
   */
  readonly fields: CartItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CartItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CartItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dataset<T extends DatasetDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DatasetDefaultArgs<ExtArgs>>): Prisma__DatasetClient<$Result.GetResult<Prisma.$DatasetPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CartItem model
   */ 
  interface CartItemFieldRefs {
    readonly id: FieldRef<"CartItem", 'String'>
    readonly userId: FieldRef<"CartItem", 'String'>
    readonly datasetId: FieldRef<"CartItem", 'String'>
    readonly addedAt: FieldRef<"CartItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CartItem findUnique
   */
  export type CartItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * Filter, which CartItem to fetch.
     */
    where: CartItemWhereUniqueInput
  }

  /**
   * CartItem findUniqueOrThrow
   */
  export type CartItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * Filter, which CartItem to fetch.
     */
    where: CartItemWhereUniqueInput
  }

  /**
   * CartItem findFirst
   */
  export type CartItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * Filter, which CartItem to fetch.
     */
    where?: CartItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CartItems to fetch.
     */
    orderBy?: CartItemOrderByWithRelationInput | CartItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CartItems.
     */
    cursor?: CartItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CartItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CartItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CartItems.
     */
    distinct?: CartItemScalarFieldEnum | CartItemScalarFieldEnum[]
  }

  /**
   * CartItem findFirstOrThrow
   */
  export type CartItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * Filter, which CartItem to fetch.
     */
    where?: CartItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CartItems to fetch.
     */
    orderBy?: CartItemOrderByWithRelationInput | CartItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CartItems.
     */
    cursor?: CartItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CartItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CartItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CartItems.
     */
    distinct?: CartItemScalarFieldEnum | CartItemScalarFieldEnum[]
  }

  /**
   * CartItem findMany
   */
  export type CartItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * Filter, which CartItems to fetch.
     */
    where?: CartItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CartItems to fetch.
     */
    orderBy?: CartItemOrderByWithRelationInput | CartItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CartItems.
     */
    cursor?: CartItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CartItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CartItems.
     */
    skip?: number
    distinct?: CartItemScalarFieldEnum | CartItemScalarFieldEnum[]
  }

  /**
   * CartItem create
   */
  export type CartItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * The data needed to create a CartItem.
     */
    data: XOR<CartItemCreateInput, CartItemUncheckedCreateInput>
  }

  /**
   * CartItem createMany
   */
  export type CartItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CartItems.
     */
    data: CartItemCreateManyInput | CartItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CartItem createManyAndReturn
   */
  export type CartItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CartItems.
     */
    data: CartItemCreateManyInput | CartItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CartItem update
   */
  export type CartItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * The data needed to update a CartItem.
     */
    data: XOR<CartItemUpdateInput, CartItemUncheckedUpdateInput>
    /**
     * Choose, which CartItem to update.
     */
    where: CartItemWhereUniqueInput
  }

  /**
   * CartItem updateMany
   */
  export type CartItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CartItems.
     */
    data: XOR<CartItemUpdateManyMutationInput, CartItemUncheckedUpdateManyInput>
    /**
     * Filter which CartItems to update
     */
    where?: CartItemWhereInput
  }

  /**
   * CartItem upsert
   */
  export type CartItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * The filter to search for the CartItem to update in case it exists.
     */
    where: CartItemWhereUniqueInput
    /**
     * In case the CartItem found by the `where` argument doesn't exist, create a new CartItem with this data.
     */
    create: XOR<CartItemCreateInput, CartItemUncheckedCreateInput>
    /**
     * In case the CartItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CartItemUpdateInput, CartItemUncheckedUpdateInput>
  }

  /**
   * CartItem delete
   */
  export type CartItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * Filter which CartItem to delete.
     */
    where: CartItemWhereUniqueInput
  }

  /**
   * CartItem deleteMany
   */
  export type CartItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CartItems to delete
     */
    where?: CartItemWhereInput
  }

  /**
   * CartItem without action
   */
  export type CartItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
  }


  /**
   * Model ProvenanceEvent
   */

  export type AggregateProvenanceEvent = {
    _count: ProvenanceEventCountAggregateOutputType | null
    _min: ProvenanceEventMinAggregateOutputType | null
    _max: ProvenanceEventMaxAggregateOutputType | null
  }

  export type ProvenanceEventMinAggregateOutputType = {
    id: string | null
    datasetId: string | null
    actor: string | null
    action: string | null
    parentId: string | null
    createdAt: Date | null
  }

  export type ProvenanceEventMaxAggregateOutputType = {
    id: string | null
    datasetId: string | null
    actor: string | null
    action: string | null
    parentId: string | null
    createdAt: Date | null
  }

  export type ProvenanceEventCountAggregateOutputType = {
    id: number
    datasetId: number
    actor: number
    action: number
    details: number
    parentId: number
    createdAt: number
    _all: number
  }


  export type ProvenanceEventMinAggregateInputType = {
    id?: true
    datasetId?: true
    actor?: true
    action?: true
    parentId?: true
    createdAt?: true
  }

  export type ProvenanceEventMaxAggregateInputType = {
    id?: true
    datasetId?: true
    actor?: true
    action?: true
    parentId?: true
    createdAt?: true
  }

  export type ProvenanceEventCountAggregateInputType = {
    id?: true
    datasetId?: true
    actor?: true
    action?: true
    details?: true
    parentId?: true
    createdAt?: true
    _all?: true
  }

  export type ProvenanceEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProvenanceEvent to aggregate.
     */
    where?: ProvenanceEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProvenanceEvents to fetch.
     */
    orderBy?: ProvenanceEventOrderByWithRelationInput | ProvenanceEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProvenanceEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProvenanceEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProvenanceEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProvenanceEvents
    **/
    _count?: true | ProvenanceEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProvenanceEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProvenanceEventMaxAggregateInputType
  }

  export type GetProvenanceEventAggregateType<T extends ProvenanceEventAggregateArgs> = {
        [P in keyof T & keyof AggregateProvenanceEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProvenanceEvent[P]>
      : GetScalarType<T[P], AggregateProvenanceEvent[P]>
  }




  export type ProvenanceEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProvenanceEventWhereInput
    orderBy?: ProvenanceEventOrderByWithAggregationInput | ProvenanceEventOrderByWithAggregationInput[]
    by: ProvenanceEventScalarFieldEnum[] | ProvenanceEventScalarFieldEnum
    having?: ProvenanceEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProvenanceEventCountAggregateInputType | true
    _min?: ProvenanceEventMinAggregateInputType
    _max?: ProvenanceEventMaxAggregateInputType
  }

  export type ProvenanceEventGroupByOutputType = {
    id: string
    datasetId: string
    actor: string
    action: string
    details: JsonValue | null
    parentId: string | null
    createdAt: Date
    _count: ProvenanceEventCountAggregateOutputType | null
    _min: ProvenanceEventMinAggregateOutputType | null
    _max: ProvenanceEventMaxAggregateOutputType | null
  }

  type GetProvenanceEventGroupByPayload<T extends ProvenanceEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProvenanceEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProvenanceEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProvenanceEventGroupByOutputType[P]>
            : GetScalarType<T[P], ProvenanceEventGroupByOutputType[P]>
        }
      >
    >


  export type ProvenanceEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    datasetId?: boolean
    actor?: boolean
    action?: boolean
    details?: boolean
    parentId?: boolean
    createdAt?: boolean
    dataset?: boolean | DatasetDefaultArgs<ExtArgs>
    parent?: boolean | ProvenanceEvent$parentArgs<ExtArgs>
    children?: boolean | ProvenanceEvent$childrenArgs<ExtArgs>
    _count?: boolean | ProvenanceEventCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["provenanceEvent"]>

  export type ProvenanceEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    datasetId?: boolean
    actor?: boolean
    action?: boolean
    details?: boolean
    parentId?: boolean
    createdAt?: boolean
    dataset?: boolean | DatasetDefaultArgs<ExtArgs>
    parent?: boolean | ProvenanceEvent$parentArgs<ExtArgs>
  }, ExtArgs["result"]["provenanceEvent"]>

  export type ProvenanceEventSelectScalar = {
    id?: boolean
    datasetId?: boolean
    actor?: boolean
    action?: boolean
    details?: boolean
    parentId?: boolean
    createdAt?: boolean
  }

  export type ProvenanceEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dataset?: boolean | DatasetDefaultArgs<ExtArgs>
    parent?: boolean | ProvenanceEvent$parentArgs<ExtArgs>
    children?: boolean | ProvenanceEvent$childrenArgs<ExtArgs>
    _count?: boolean | ProvenanceEventCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProvenanceEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dataset?: boolean | DatasetDefaultArgs<ExtArgs>
    parent?: boolean | ProvenanceEvent$parentArgs<ExtArgs>
  }

  export type $ProvenanceEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProvenanceEvent"
    objects: {
      dataset: Prisma.$DatasetPayload<ExtArgs>
      parent: Prisma.$ProvenanceEventPayload<ExtArgs> | null
      children: Prisma.$ProvenanceEventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      datasetId: string
      actor: string
      action: string
      details: Prisma.JsonValue | null
      parentId: string | null
      createdAt: Date
    }, ExtArgs["result"]["provenanceEvent"]>
    composites: {}
  }

  type ProvenanceEventGetPayload<S extends boolean | null | undefined | ProvenanceEventDefaultArgs> = $Result.GetResult<Prisma.$ProvenanceEventPayload, S>

  type ProvenanceEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProvenanceEventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProvenanceEventCountAggregateInputType | true
    }

  export interface ProvenanceEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProvenanceEvent'], meta: { name: 'ProvenanceEvent' } }
    /**
     * Find zero or one ProvenanceEvent that matches the filter.
     * @param {ProvenanceEventFindUniqueArgs} args - Arguments to find a ProvenanceEvent
     * @example
     * // Get one ProvenanceEvent
     * const provenanceEvent = await prisma.provenanceEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProvenanceEventFindUniqueArgs>(args: SelectSubset<T, ProvenanceEventFindUniqueArgs<ExtArgs>>): Prisma__ProvenanceEventClient<$Result.GetResult<Prisma.$ProvenanceEventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ProvenanceEvent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProvenanceEventFindUniqueOrThrowArgs} args - Arguments to find a ProvenanceEvent
     * @example
     * // Get one ProvenanceEvent
     * const provenanceEvent = await prisma.provenanceEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProvenanceEventFindUniqueOrThrowArgs>(args: SelectSubset<T, ProvenanceEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProvenanceEventClient<$Result.GetResult<Prisma.$ProvenanceEventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ProvenanceEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProvenanceEventFindFirstArgs} args - Arguments to find a ProvenanceEvent
     * @example
     * // Get one ProvenanceEvent
     * const provenanceEvent = await prisma.provenanceEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProvenanceEventFindFirstArgs>(args?: SelectSubset<T, ProvenanceEventFindFirstArgs<ExtArgs>>): Prisma__ProvenanceEventClient<$Result.GetResult<Prisma.$ProvenanceEventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ProvenanceEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProvenanceEventFindFirstOrThrowArgs} args - Arguments to find a ProvenanceEvent
     * @example
     * // Get one ProvenanceEvent
     * const provenanceEvent = await prisma.provenanceEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProvenanceEventFindFirstOrThrowArgs>(args?: SelectSubset<T, ProvenanceEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProvenanceEventClient<$Result.GetResult<Prisma.$ProvenanceEventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ProvenanceEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProvenanceEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProvenanceEvents
     * const provenanceEvents = await prisma.provenanceEvent.findMany()
     * 
     * // Get first 10 ProvenanceEvents
     * const provenanceEvents = await prisma.provenanceEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const provenanceEventWithIdOnly = await prisma.provenanceEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProvenanceEventFindManyArgs>(args?: SelectSubset<T, ProvenanceEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProvenanceEventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ProvenanceEvent.
     * @param {ProvenanceEventCreateArgs} args - Arguments to create a ProvenanceEvent.
     * @example
     * // Create one ProvenanceEvent
     * const ProvenanceEvent = await prisma.provenanceEvent.create({
     *   data: {
     *     // ... data to create a ProvenanceEvent
     *   }
     * })
     * 
     */
    create<T extends ProvenanceEventCreateArgs>(args: SelectSubset<T, ProvenanceEventCreateArgs<ExtArgs>>): Prisma__ProvenanceEventClient<$Result.GetResult<Prisma.$ProvenanceEventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ProvenanceEvents.
     * @param {ProvenanceEventCreateManyArgs} args - Arguments to create many ProvenanceEvents.
     * @example
     * // Create many ProvenanceEvents
     * const provenanceEvent = await prisma.provenanceEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProvenanceEventCreateManyArgs>(args?: SelectSubset<T, ProvenanceEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProvenanceEvents and returns the data saved in the database.
     * @param {ProvenanceEventCreateManyAndReturnArgs} args - Arguments to create many ProvenanceEvents.
     * @example
     * // Create many ProvenanceEvents
     * const provenanceEvent = await prisma.provenanceEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProvenanceEvents and only return the `id`
     * const provenanceEventWithIdOnly = await prisma.provenanceEvent.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProvenanceEventCreateManyAndReturnArgs>(args?: SelectSubset<T, ProvenanceEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProvenanceEventPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ProvenanceEvent.
     * @param {ProvenanceEventDeleteArgs} args - Arguments to delete one ProvenanceEvent.
     * @example
     * // Delete one ProvenanceEvent
     * const ProvenanceEvent = await prisma.provenanceEvent.delete({
     *   where: {
     *     // ... filter to delete one ProvenanceEvent
     *   }
     * })
     * 
     */
    delete<T extends ProvenanceEventDeleteArgs>(args: SelectSubset<T, ProvenanceEventDeleteArgs<ExtArgs>>): Prisma__ProvenanceEventClient<$Result.GetResult<Prisma.$ProvenanceEventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ProvenanceEvent.
     * @param {ProvenanceEventUpdateArgs} args - Arguments to update one ProvenanceEvent.
     * @example
     * // Update one ProvenanceEvent
     * const provenanceEvent = await prisma.provenanceEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProvenanceEventUpdateArgs>(args: SelectSubset<T, ProvenanceEventUpdateArgs<ExtArgs>>): Prisma__ProvenanceEventClient<$Result.GetResult<Prisma.$ProvenanceEventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ProvenanceEvents.
     * @param {ProvenanceEventDeleteManyArgs} args - Arguments to filter ProvenanceEvents to delete.
     * @example
     * // Delete a few ProvenanceEvents
     * const { count } = await prisma.provenanceEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProvenanceEventDeleteManyArgs>(args?: SelectSubset<T, ProvenanceEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProvenanceEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProvenanceEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProvenanceEvents
     * const provenanceEvent = await prisma.provenanceEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProvenanceEventUpdateManyArgs>(args: SelectSubset<T, ProvenanceEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProvenanceEvent.
     * @param {ProvenanceEventUpsertArgs} args - Arguments to update or create a ProvenanceEvent.
     * @example
     * // Update or create a ProvenanceEvent
     * const provenanceEvent = await prisma.provenanceEvent.upsert({
     *   create: {
     *     // ... data to create a ProvenanceEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProvenanceEvent we want to update
     *   }
     * })
     */
    upsert<T extends ProvenanceEventUpsertArgs>(args: SelectSubset<T, ProvenanceEventUpsertArgs<ExtArgs>>): Prisma__ProvenanceEventClient<$Result.GetResult<Prisma.$ProvenanceEventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ProvenanceEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProvenanceEventCountArgs} args - Arguments to filter ProvenanceEvents to count.
     * @example
     * // Count the number of ProvenanceEvents
     * const count = await prisma.provenanceEvent.count({
     *   where: {
     *     // ... the filter for the ProvenanceEvents we want to count
     *   }
     * })
    **/
    count<T extends ProvenanceEventCountArgs>(
      args?: Subset<T, ProvenanceEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProvenanceEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProvenanceEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProvenanceEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProvenanceEventAggregateArgs>(args: Subset<T, ProvenanceEventAggregateArgs>): Prisma.PrismaPromise<GetProvenanceEventAggregateType<T>>

    /**
     * Group by ProvenanceEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProvenanceEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProvenanceEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProvenanceEventGroupByArgs['orderBy'] }
        : { orderBy?: ProvenanceEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProvenanceEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProvenanceEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProvenanceEvent model
   */
  readonly fields: ProvenanceEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProvenanceEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProvenanceEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dataset<T extends DatasetDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DatasetDefaultArgs<ExtArgs>>): Prisma__DatasetClient<$Result.GetResult<Prisma.$DatasetPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    parent<T extends ProvenanceEvent$parentArgs<ExtArgs> = {}>(args?: Subset<T, ProvenanceEvent$parentArgs<ExtArgs>>): Prisma__ProvenanceEventClient<$Result.GetResult<Prisma.$ProvenanceEventPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    children<T extends ProvenanceEvent$childrenArgs<ExtArgs> = {}>(args?: Subset<T, ProvenanceEvent$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProvenanceEventPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProvenanceEvent model
   */ 
  interface ProvenanceEventFieldRefs {
    readonly id: FieldRef<"ProvenanceEvent", 'String'>
    readonly datasetId: FieldRef<"ProvenanceEvent", 'String'>
    readonly actor: FieldRef<"ProvenanceEvent", 'String'>
    readonly action: FieldRef<"ProvenanceEvent", 'String'>
    readonly details: FieldRef<"ProvenanceEvent", 'Json'>
    readonly parentId: FieldRef<"ProvenanceEvent", 'String'>
    readonly createdAt: FieldRef<"ProvenanceEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProvenanceEvent findUnique
   */
  export type ProvenanceEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvenanceEvent
     */
    select?: ProvenanceEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvenanceEventInclude<ExtArgs> | null
    /**
     * Filter, which ProvenanceEvent to fetch.
     */
    where: ProvenanceEventWhereUniqueInput
  }

  /**
   * ProvenanceEvent findUniqueOrThrow
   */
  export type ProvenanceEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvenanceEvent
     */
    select?: ProvenanceEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvenanceEventInclude<ExtArgs> | null
    /**
     * Filter, which ProvenanceEvent to fetch.
     */
    where: ProvenanceEventWhereUniqueInput
  }

  /**
   * ProvenanceEvent findFirst
   */
  export type ProvenanceEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvenanceEvent
     */
    select?: ProvenanceEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvenanceEventInclude<ExtArgs> | null
    /**
     * Filter, which ProvenanceEvent to fetch.
     */
    where?: ProvenanceEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProvenanceEvents to fetch.
     */
    orderBy?: ProvenanceEventOrderByWithRelationInput | ProvenanceEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProvenanceEvents.
     */
    cursor?: ProvenanceEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProvenanceEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProvenanceEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProvenanceEvents.
     */
    distinct?: ProvenanceEventScalarFieldEnum | ProvenanceEventScalarFieldEnum[]
  }

  /**
   * ProvenanceEvent findFirstOrThrow
   */
  export type ProvenanceEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvenanceEvent
     */
    select?: ProvenanceEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvenanceEventInclude<ExtArgs> | null
    /**
     * Filter, which ProvenanceEvent to fetch.
     */
    where?: ProvenanceEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProvenanceEvents to fetch.
     */
    orderBy?: ProvenanceEventOrderByWithRelationInput | ProvenanceEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProvenanceEvents.
     */
    cursor?: ProvenanceEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProvenanceEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProvenanceEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProvenanceEvents.
     */
    distinct?: ProvenanceEventScalarFieldEnum | ProvenanceEventScalarFieldEnum[]
  }

  /**
   * ProvenanceEvent findMany
   */
  export type ProvenanceEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvenanceEvent
     */
    select?: ProvenanceEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvenanceEventInclude<ExtArgs> | null
    /**
     * Filter, which ProvenanceEvents to fetch.
     */
    where?: ProvenanceEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProvenanceEvents to fetch.
     */
    orderBy?: ProvenanceEventOrderByWithRelationInput | ProvenanceEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProvenanceEvents.
     */
    cursor?: ProvenanceEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProvenanceEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProvenanceEvents.
     */
    skip?: number
    distinct?: ProvenanceEventScalarFieldEnum | ProvenanceEventScalarFieldEnum[]
  }

  /**
   * ProvenanceEvent create
   */
  export type ProvenanceEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvenanceEvent
     */
    select?: ProvenanceEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvenanceEventInclude<ExtArgs> | null
    /**
     * The data needed to create a ProvenanceEvent.
     */
    data: XOR<ProvenanceEventCreateInput, ProvenanceEventUncheckedCreateInput>
  }

  /**
   * ProvenanceEvent createMany
   */
  export type ProvenanceEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProvenanceEvents.
     */
    data: ProvenanceEventCreateManyInput | ProvenanceEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProvenanceEvent createManyAndReturn
   */
  export type ProvenanceEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvenanceEvent
     */
    select?: ProvenanceEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ProvenanceEvents.
     */
    data: ProvenanceEventCreateManyInput | ProvenanceEventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvenanceEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProvenanceEvent update
   */
  export type ProvenanceEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvenanceEvent
     */
    select?: ProvenanceEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvenanceEventInclude<ExtArgs> | null
    /**
     * The data needed to update a ProvenanceEvent.
     */
    data: XOR<ProvenanceEventUpdateInput, ProvenanceEventUncheckedUpdateInput>
    /**
     * Choose, which ProvenanceEvent to update.
     */
    where: ProvenanceEventWhereUniqueInput
  }

  /**
   * ProvenanceEvent updateMany
   */
  export type ProvenanceEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProvenanceEvents.
     */
    data: XOR<ProvenanceEventUpdateManyMutationInput, ProvenanceEventUncheckedUpdateManyInput>
    /**
     * Filter which ProvenanceEvents to update
     */
    where?: ProvenanceEventWhereInput
  }

  /**
   * ProvenanceEvent upsert
   */
  export type ProvenanceEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvenanceEvent
     */
    select?: ProvenanceEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvenanceEventInclude<ExtArgs> | null
    /**
     * The filter to search for the ProvenanceEvent to update in case it exists.
     */
    where: ProvenanceEventWhereUniqueInput
    /**
     * In case the ProvenanceEvent found by the `where` argument doesn't exist, create a new ProvenanceEvent with this data.
     */
    create: XOR<ProvenanceEventCreateInput, ProvenanceEventUncheckedCreateInput>
    /**
     * In case the ProvenanceEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProvenanceEventUpdateInput, ProvenanceEventUncheckedUpdateInput>
  }

  /**
   * ProvenanceEvent delete
   */
  export type ProvenanceEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvenanceEvent
     */
    select?: ProvenanceEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvenanceEventInclude<ExtArgs> | null
    /**
     * Filter which ProvenanceEvent to delete.
     */
    where: ProvenanceEventWhereUniqueInput
  }

  /**
   * ProvenanceEvent deleteMany
   */
  export type ProvenanceEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProvenanceEvents to delete
     */
    where?: ProvenanceEventWhereInput
  }

  /**
   * ProvenanceEvent.parent
   */
  export type ProvenanceEvent$parentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvenanceEvent
     */
    select?: ProvenanceEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvenanceEventInclude<ExtArgs> | null
    where?: ProvenanceEventWhereInput
  }

  /**
   * ProvenanceEvent.children
   */
  export type ProvenanceEvent$childrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvenanceEvent
     */
    select?: ProvenanceEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvenanceEventInclude<ExtArgs> | null
    where?: ProvenanceEventWhereInput
    orderBy?: ProvenanceEventOrderByWithRelationInput | ProvenanceEventOrderByWithRelationInput[]
    cursor?: ProvenanceEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProvenanceEventScalarFieldEnum | ProvenanceEventScalarFieldEnum[]
  }

  /**
   * ProvenanceEvent without action
   */
  export type ProvenanceEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProvenanceEvent
     */
    select?: ProvenanceEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProvenanceEventInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const DatasetScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    ownerId: 'ownerId',
    task: 'task',
    embodiments: 'embodiments',
    episodeCount: 'episodeCount',
    totalDurationHours: 'totalDurationHours',
    sizeGb: 'sizeGb',
    qualityScore: 'qualityScore',
    format: 'format',
    pricingTier: 'pricingTier',
    pricePerEpisode: 'pricePerEpisode',
    tags: 'tags',
    downloads: 'downloads',
    rating: 'rating',
    accessLevel: 'accessLevel',
    licenseType: 'licenseType',
    storageUrl: 'storageUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DatasetScalarFieldEnum = (typeof DatasetScalarFieldEnum)[keyof typeof DatasetScalarFieldEnum]


  export const ReviewScalarFieldEnum: {
    id: 'id',
    datasetId: 'datasetId',
    userId: 'userId',
    userName: 'userName',
    rating: 'rating',
    comment: 'comment',
    createdAt: 'createdAt'
  };

  export type ReviewScalarFieldEnum = (typeof ReviewScalarFieldEnum)[keyof typeof ReviewScalarFieldEnum]


  export const PurchaseScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    datasetId: 'datasetId',
    amount: 'amount',
    currency: 'currency',
    stripePaymentId: 'stripePaymentId',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type PurchaseScalarFieldEnum = (typeof PurchaseScalarFieldEnum)[keyof typeof PurchaseScalarFieldEnum]


  export const CartItemScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    datasetId: 'datasetId',
    addedAt: 'addedAt'
  };

  export type CartItemScalarFieldEnum = (typeof CartItemScalarFieldEnum)[keyof typeof CartItemScalarFieldEnum]


  export const ProvenanceEventScalarFieldEnum: {
    id: 'id',
    datasetId: 'datasetId',
    actor: 'actor',
    action: 'action',
    details: 'details',
    parentId: 'parentId',
    createdAt: 'createdAt'
  };

  export type ProvenanceEventScalarFieldEnum = (typeof ProvenanceEventScalarFieldEnum)[keyof typeof ProvenanceEventScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    
  /**
   * Deep Input Types
   */


  export type DatasetWhereInput = {
    AND?: DatasetWhereInput | DatasetWhereInput[]
    OR?: DatasetWhereInput[]
    NOT?: DatasetWhereInput | DatasetWhereInput[]
    id?: StringFilter<"Dataset"> | string
    name?: StringFilter<"Dataset"> | string
    description?: StringFilter<"Dataset"> | string
    ownerId?: StringFilter<"Dataset"> | string
    task?: StringFilter<"Dataset"> | string
    embodiments?: StringNullableListFilter<"Dataset">
    episodeCount?: IntFilter<"Dataset"> | number
    totalDurationHours?: FloatFilter<"Dataset"> | number
    sizeGb?: FloatFilter<"Dataset"> | number
    qualityScore?: FloatFilter<"Dataset"> | number
    format?: StringFilter<"Dataset"> | string
    pricingTier?: StringFilter<"Dataset"> | string
    pricePerEpisode?: IntNullableFilter<"Dataset"> | number | null
    tags?: StringNullableListFilter<"Dataset">
    downloads?: IntFilter<"Dataset"> | number
    rating?: FloatFilter<"Dataset"> | number
    accessLevel?: StringFilter<"Dataset"> | string
    licenseType?: StringFilter<"Dataset"> | string
    storageUrl?: StringNullableFilter<"Dataset"> | string | null
    createdAt?: DateTimeFilter<"Dataset"> | Date | string
    updatedAt?: DateTimeFilter<"Dataset"> | Date | string
    reviews?: ReviewListRelationFilter
    purchases?: PurchaseListRelationFilter
    cartItems?: CartItemListRelationFilter
    provenance?: ProvenanceEventListRelationFilter
  }

  export type DatasetOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    ownerId?: SortOrder
    task?: SortOrder
    embodiments?: SortOrder
    episodeCount?: SortOrder
    totalDurationHours?: SortOrder
    sizeGb?: SortOrder
    qualityScore?: SortOrder
    format?: SortOrder
    pricingTier?: SortOrder
    pricePerEpisode?: SortOrderInput | SortOrder
    tags?: SortOrder
    downloads?: SortOrder
    rating?: SortOrder
    accessLevel?: SortOrder
    licenseType?: SortOrder
    storageUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    reviews?: ReviewOrderByRelationAggregateInput
    purchases?: PurchaseOrderByRelationAggregateInput
    cartItems?: CartItemOrderByRelationAggregateInput
    provenance?: ProvenanceEventOrderByRelationAggregateInput
  }

  export type DatasetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DatasetWhereInput | DatasetWhereInput[]
    OR?: DatasetWhereInput[]
    NOT?: DatasetWhereInput | DatasetWhereInput[]
    name?: StringFilter<"Dataset"> | string
    description?: StringFilter<"Dataset"> | string
    ownerId?: StringFilter<"Dataset"> | string
    task?: StringFilter<"Dataset"> | string
    embodiments?: StringNullableListFilter<"Dataset">
    episodeCount?: IntFilter<"Dataset"> | number
    totalDurationHours?: FloatFilter<"Dataset"> | number
    sizeGb?: FloatFilter<"Dataset"> | number
    qualityScore?: FloatFilter<"Dataset"> | number
    format?: StringFilter<"Dataset"> | string
    pricingTier?: StringFilter<"Dataset"> | string
    pricePerEpisode?: IntNullableFilter<"Dataset"> | number | null
    tags?: StringNullableListFilter<"Dataset">
    downloads?: IntFilter<"Dataset"> | number
    rating?: FloatFilter<"Dataset"> | number
    accessLevel?: StringFilter<"Dataset"> | string
    licenseType?: StringFilter<"Dataset"> | string
    storageUrl?: StringNullableFilter<"Dataset"> | string | null
    createdAt?: DateTimeFilter<"Dataset"> | Date | string
    updatedAt?: DateTimeFilter<"Dataset"> | Date | string
    reviews?: ReviewListRelationFilter
    purchases?: PurchaseListRelationFilter
    cartItems?: CartItemListRelationFilter
    provenance?: ProvenanceEventListRelationFilter
  }, "id">

  export type DatasetOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    ownerId?: SortOrder
    task?: SortOrder
    embodiments?: SortOrder
    episodeCount?: SortOrder
    totalDurationHours?: SortOrder
    sizeGb?: SortOrder
    qualityScore?: SortOrder
    format?: SortOrder
    pricingTier?: SortOrder
    pricePerEpisode?: SortOrderInput | SortOrder
    tags?: SortOrder
    downloads?: SortOrder
    rating?: SortOrder
    accessLevel?: SortOrder
    licenseType?: SortOrder
    storageUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DatasetCountOrderByAggregateInput
    _avg?: DatasetAvgOrderByAggregateInput
    _max?: DatasetMaxOrderByAggregateInput
    _min?: DatasetMinOrderByAggregateInput
    _sum?: DatasetSumOrderByAggregateInput
  }

  export type DatasetScalarWhereWithAggregatesInput = {
    AND?: DatasetScalarWhereWithAggregatesInput | DatasetScalarWhereWithAggregatesInput[]
    OR?: DatasetScalarWhereWithAggregatesInput[]
    NOT?: DatasetScalarWhereWithAggregatesInput | DatasetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Dataset"> | string
    name?: StringWithAggregatesFilter<"Dataset"> | string
    description?: StringWithAggregatesFilter<"Dataset"> | string
    ownerId?: StringWithAggregatesFilter<"Dataset"> | string
    task?: StringWithAggregatesFilter<"Dataset"> | string
    embodiments?: StringNullableListFilter<"Dataset">
    episodeCount?: IntWithAggregatesFilter<"Dataset"> | number
    totalDurationHours?: FloatWithAggregatesFilter<"Dataset"> | number
    sizeGb?: FloatWithAggregatesFilter<"Dataset"> | number
    qualityScore?: FloatWithAggregatesFilter<"Dataset"> | number
    format?: StringWithAggregatesFilter<"Dataset"> | string
    pricingTier?: StringWithAggregatesFilter<"Dataset"> | string
    pricePerEpisode?: IntNullableWithAggregatesFilter<"Dataset"> | number | null
    tags?: StringNullableListFilter<"Dataset">
    downloads?: IntWithAggregatesFilter<"Dataset"> | number
    rating?: FloatWithAggregatesFilter<"Dataset"> | number
    accessLevel?: StringWithAggregatesFilter<"Dataset"> | string
    licenseType?: StringWithAggregatesFilter<"Dataset"> | string
    storageUrl?: StringNullableWithAggregatesFilter<"Dataset"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Dataset"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Dataset"> | Date | string
  }

  export type ReviewWhereInput = {
    AND?: ReviewWhereInput | ReviewWhereInput[]
    OR?: ReviewWhereInput[]
    NOT?: ReviewWhereInput | ReviewWhereInput[]
    id?: StringFilter<"Review"> | string
    datasetId?: StringFilter<"Review"> | string
    userId?: StringFilter<"Review"> | string
    userName?: StringFilter<"Review"> | string
    rating?: IntFilter<"Review"> | number
    comment?: StringFilter<"Review"> | string
    createdAt?: DateTimeFilter<"Review"> | Date | string
    dataset?: XOR<DatasetRelationFilter, DatasetWhereInput>
  }

  export type ReviewOrderByWithRelationInput = {
    id?: SortOrder
    datasetId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    rating?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
    dataset?: DatasetOrderByWithRelationInput
  }

  export type ReviewWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    datasetId_userId?: ReviewDatasetIdUserIdCompoundUniqueInput
    AND?: ReviewWhereInput | ReviewWhereInput[]
    OR?: ReviewWhereInput[]
    NOT?: ReviewWhereInput | ReviewWhereInput[]
    datasetId?: StringFilter<"Review"> | string
    userId?: StringFilter<"Review"> | string
    userName?: StringFilter<"Review"> | string
    rating?: IntFilter<"Review"> | number
    comment?: StringFilter<"Review"> | string
    createdAt?: DateTimeFilter<"Review"> | Date | string
    dataset?: XOR<DatasetRelationFilter, DatasetWhereInput>
  }, "id" | "datasetId_userId">

  export type ReviewOrderByWithAggregationInput = {
    id?: SortOrder
    datasetId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    rating?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
    _count?: ReviewCountOrderByAggregateInput
    _avg?: ReviewAvgOrderByAggregateInput
    _max?: ReviewMaxOrderByAggregateInput
    _min?: ReviewMinOrderByAggregateInput
    _sum?: ReviewSumOrderByAggregateInput
  }

  export type ReviewScalarWhereWithAggregatesInput = {
    AND?: ReviewScalarWhereWithAggregatesInput | ReviewScalarWhereWithAggregatesInput[]
    OR?: ReviewScalarWhereWithAggregatesInput[]
    NOT?: ReviewScalarWhereWithAggregatesInput | ReviewScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Review"> | string
    datasetId?: StringWithAggregatesFilter<"Review"> | string
    userId?: StringWithAggregatesFilter<"Review"> | string
    userName?: StringWithAggregatesFilter<"Review"> | string
    rating?: IntWithAggregatesFilter<"Review"> | number
    comment?: StringWithAggregatesFilter<"Review"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Review"> | Date | string
  }

  export type PurchaseWhereInput = {
    AND?: PurchaseWhereInput | PurchaseWhereInput[]
    OR?: PurchaseWhereInput[]
    NOT?: PurchaseWhereInput | PurchaseWhereInput[]
    id?: StringFilter<"Purchase"> | string
    userId?: StringFilter<"Purchase"> | string
    datasetId?: StringFilter<"Purchase"> | string
    amount?: IntFilter<"Purchase"> | number
    currency?: StringFilter<"Purchase"> | string
    stripePaymentId?: StringNullableFilter<"Purchase"> | string | null
    status?: StringFilter<"Purchase"> | string
    createdAt?: DateTimeFilter<"Purchase"> | Date | string
    dataset?: XOR<DatasetRelationFilter, DatasetWhereInput>
  }

  export type PurchaseOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    datasetId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    stripePaymentId?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    dataset?: DatasetOrderByWithRelationInput
  }

  export type PurchaseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    stripePaymentId?: string
    AND?: PurchaseWhereInput | PurchaseWhereInput[]
    OR?: PurchaseWhereInput[]
    NOT?: PurchaseWhereInput | PurchaseWhereInput[]
    userId?: StringFilter<"Purchase"> | string
    datasetId?: StringFilter<"Purchase"> | string
    amount?: IntFilter<"Purchase"> | number
    currency?: StringFilter<"Purchase"> | string
    status?: StringFilter<"Purchase"> | string
    createdAt?: DateTimeFilter<"Purchase"> | Date | string
    dataset?: XOR<DatasetRelationFilter, DatasetWhereInput>
  }, "id" | "stripePaymentId">

  export type PurchaseOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    datasetId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    stripePaymentId?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: PurchaseCountOrderByAggregateInput
    _avg?: PurchaseAvgOrderByAggregateInput
    _max?: PurchaseMaxOrderByAggregateInput
    _min?: PurchaseMinOrderByAggregateInput
    _sum?: PurchaseSumOrderByAggregateInput
  }

  export type PurchaseScalarWhereWithAggregatesInput = {
    AND?: PurchaseScalarWhereWithAggregatesInput | PurchaseScalarWhereWithAggregatesInput[]
    OR?: PurchaseScalarWhereWithAggregatesInput[]
    NOT?: PurchaseScalarWhereWithAggregatesInput | PurchaseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Purchase"> | string
    userId?: StringWithAggregatesFilter<"Purchase"> | string
    datasetId?: StringWithAggregatesFilter<"Purchase"> | string
    amount?: IntWithAggregatesFilter<"Purchase"> | number
    currency?: StringWithAggregatesFilter<"Purchase"> | string
    stripePaymentId?: StringNullableWithAggregatesFilter<"Purchase"> | string | null
    status?: StringWithAggregatesFilter<"Purchase"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Purchase"> | Date | string
  }

  export type CartItemWhereInput = {
    AND?: CartItemWhereInput | CartItemWhereInput[]
    OR?: CartItemWhereInput[]
    NOT?: CartItemWhereInput | CartItemWhereInput[]
    id?: StringFilter<"CartItem"> | string
    userId?: StringFilter<"CartItem"> | string
    datasetId?: StringFilter<"CartItem"> | string
    addedAt?: DateTimeFilter<"CartItem"> | Date | string
    dataset?: XOR<DatasetRelationFilter, DatasetWhereInput>
  }

  export type CartItemOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    datasetId?: SortOrder
    addedAt?: SortOrder
    dataset?: DatasetOrderByWithRelationInput
  }

  export type CartItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_datasetId?: CartItemUserIdDatasetIdCompoundUniqueInput
    AND?: CartItemWhereInput | CartItemWhereInput[]
    OR?: CartItemWhereInput[]
    NOT?: CartItemWhereInput | CartItemWhereInput[]
    userId?: StringFilter<"CartItem"> | string
    datasetId?: StringFilter<"CartItem"> | string
    addedAt?: DateTimeFilter<"CartItem"> | Date | string
    dataset?: XOR<DatasetRelationFilter, DatasetWhereInput>
  }, "id" | "userId_datasetId">

  export type CartItemOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    datasetId?: SortOrder
    addedAt?: SortOrder
    _count?: CartItemCountOrderByAggregateInput
    _max?: CartItemMaxOrderByAggregateInput
    _min?: CartItemMinOrderByAggregateInput
  }

  export type CartItemScalarWhereWithAggregatesInput = {
    AND?: CartItemScalarWhereWithAggregatesInput | CartItemScalarWhereWithAggregatesInput[]
    OR?: CartItemScalarWhereWithAggregatesInput[]
    NOT?: CartItemScalarWhereWithAggregatesInput | CartItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CartItem"> | string
    userId?: StringWithAggregatesFilter<"CartItem"> | string
    datasetId?: StringWithAggregatesFilter<"CartItem"> | string
    addedAt?: DateTimeWithAggregatesFilter<"CartItem"> | Date | string
  }

  export type ProvenanceEventWhereInput = {
    AND?: ProvenanceEventWhereInput | ProvenanceEventWhereInput[]
    OR?: ProvenanceEventWhereInput[]
    NOT?: ProvenanceEventWhereInput | ProvenanceEventWhereInput[]
    id?: StringFilter<"ProvenanceEvent"> | string
    datasetId?: StringFilter<"ProvenanceEvent"> | string
    actor?: StringFilter<"ProvenanceEvent"> | string
    action?: StringFilter<"ProvenanceEvent"> | string
    details?: JsonNullableFilter<"ProvenanceEvent">
    parentId?: StringNullableFilter<"ProvenanceEvent"> | string | null
    createdAt?: DateTimeFilter<"ProvenanceEvent"> | Date | string
    dataset?: XOR<DatasetRelationFilter, DatasetWhereInput>
    parent?: XOR<ProvenanceEventNullableRelationFilter, ProvenanceEventWhereInput> | null
    children?: ProvenanceEventListRelationFilter
  }

  export type ProvenanceEventOrderByWithRelationInput = {
    id?: SortOrder
    datasetId?: SortOrder
    actor?: SortOrder
    action?: SortOrder
    details?: SortOrderInput | SortOrder
    parentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    dataset?: DatasetOrderByWithRelationInput
    parent?: ProvenanceEventOrderByWithRelationInput
    children?: ProvenanceEventOrderByRelationAggregateInput
  }

  export type ProvenanceEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProvenanceEventWhereInput | ProvenanceEventWhereInput[]
    OR?: ProvenanceEventWhereInput[]
    NOT?: ProvenanceEventWhereInput | ProvenanceEventWhereInput[]
    datasetId?: StringFilter<"ProvenanceEvent"> | string
    actor?: StringFilter<"ProvenanceEvent"> | string
    action?: StringFilter<"ProvenanceEvent"> | string
    details?: JsonNullableFilter<"ProvenanceEvent">
    parentId?: StringNullableFilter<"ProvenanceEvent"> | string | null
    createdAt?: DateTimeFilter<"ProvenanceEvent"> | Date | string
    dataset?: XOR<DatasetRelationFilter, DatasetWhereInput>
    parent?: XOR<ProvenanceEventNullableRelationFilter, ProvenanceEventWhereInput> | null
    children?: ProvenanceEventListRelationFilter
  }, "id">

  export type ProvenanceEventOrderByWithAggregationInput = {
    id?: SortOrder
    datasetId?: SortOrder
    actor?: SortOrder
    action?: SortOrder
    details?: SortOrderInput | SortOrder
    parentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ProvenanceEventCountOrderByAggregateInput
    _max?: ProvenanceEventMaxOrderByAggregateInput
    _min?: ProvenanceEventMinOrderByAggregateInput
  }

  export type ProvenanceEventScalarWhereWithAggregatesInput = {
    AND?: ProvenanceEventScalarWhereWithAggregatesInput | ProvenanceEventScalarWhereWithAggregatesInput[]
    OR?: ProvenanceEventScalarWhereWithAggregatesInput[]
    NOT?: ProvenanceEventScalarWhereWithAggregatesInput | ProvenanceEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProvenanceEvent"> | string
    datasetId?: StringWithAggregatesFilter<"ProvenanceEvent"> | string
    actor?: StringWithAggregatesFilter<"ProvenanceEvent"> | string
    action?: StringWithAggregatesFilter<"ProvenanceEvent"> | string
    details?: JsonNullableWithAggregatesFilter<"ProvenanceEvent">
    parentId?: StringNullableWithAggregatesFilter<"ProvenanceEvent"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ProvenanceEvent"> | Date | string
  }

  export type DatasetCreateInput = {
    id?: string
    name: string
    description: string
    ownerId: string
    task: string
    embodiments?: DatasetCreateembodimentsInput | string[]
    episodeCount?: number
    totalDurationHours?: number
    sizeGb?: number
    qualityScore?: number
    format?: string
    pricingTier?: string
    pricePerEpisode?: number | null
    tags?: DatasetCreatetagsInput | string[]
    downloads?: number
    rating?: number
    accessLevel?: string
    licenseType?: string
    storageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviews?: ReviewCreateNestedManyWithoutDatasetInput
    purchases?: PurchaseCreateNestedManyWithoutDatasetInput
    cartItems?: CartItemCreateNestedManyWithoutDatasetInput
    provenance?: ProvenanceEventCreateNestedManyWithoutDatasetInput
  }

  export type DatasetUncheckedCreateInput = {
    id?: string
    name: string
    description: string
    ownerId: string
    task: string
    embodiments?: DatasetCreateembodimentsInput | string[]
    episodeCount?: number
    totalDurationHours?: number
    sizeGb?: number
    qualityScore?: number
    format?: string
    pricingTier?: string
    pricePerEpisode?: number | null
    tags?: DatasetCreatetagsInput | string[]
    downloads?: number
    rating?: number
    accessLevel?: string
    licenseType?: string
    storageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviews?: ReviewUncheckedCreateNestedManyWithoutDatasetInput
    purchases?: PurchaseUncheckedCreateNestedManyWithoutDatasetInput
    cartItems?: CartItemUncheckedCreateNestedManyWithoutDatasetInput
    provenance?: ProvenanceEventUncheckedCreateNestedManyWithoutDatasetInput
  }

  export type DatasetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    task?: StringFieldUpdateOperationsInput | string
    embodiments?: DatasetUpdateembodimentsInput | string[]
    episodeCount?: IntFieldUpdateOperationsInput | number
    totalDurationHours?: FloatFieldUpdateOperationsInput | number
    sizeGb?: FloatFieldUpdateOperationsInput | number
    qualityScore?: FloatFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    pricingTier?: StringFieldUpdateOperationsInput | string
    pricePerEpisode?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: DatasetUpdatetagsInput | string[]
    downloads?: IntFieldUpdateOperationsInput | number
    rating?: FloatFieldUpdateOperationsInput | number
    accessLevel?: StringFieldUpdateOperationsInput | string
    licenseType?: StringFieldUpdateOperationsInput | string
    storageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviews?: ReviewUpdateManyWithoutDatasetNestedInput
    purchases?: PurchaseUpdateManyWithoutDatasetNestedInput
    cartItems?: CartItemUpdateManyWithoutDatasetNestedInput
    provenance?: ProvenanceEventUpdateManyWithoutDatasetNestedInput
  }

  export type DatasetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    task?: StringFieldUpdateOperationsInput | string
    embodiments?: DatasetUpdateembodimentsInput | string[]
    episodeCount?: IntFieldUpdateOperationsInput | number
    totalDurationHours?: FloatFieldUpdateOperationsInput | number
    sizeGb?: FloatFieldUpdateOperationsInput | number
    qualityScore?: FloatFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    pricingTier?: StringFieldUpdateOperationsInput | string
    pricePerEpisode?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: DatasetUpdatetagsInput | string[]
    downloads?: IntFieldUpdateOperationsInput | number
    rating?: FloatFieldUpdateOperationsInput | number
    accessLevel?: StringFieldUpdateOperationsInput | string
    licenseType?: StringFieldUpdateOperationsInput | string
    storageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviews?: ReviewUncheckedUpdateManyWithoutDatasetNestedInput
    purchases?: PurchaseUncheckedUpdateManyWithoutDatasetNestedInput
    cartItems?: CartItemUncheckedUpdateManyWithoutDatasetNestedInput
    provenance?: ProvenanceEventUncheckedUpdateManyWithoutDatasetNestedInput
  }

  export type DatasetCreateManyInput = {
    id?: string
    name: string
    description: string
    ownerId: string
    task: string
    embodiments?: DatasetCreateembodimentsInput | string[]
    episodeCount?: number
    totalDurationHours?: number
    sizeGb?: number
    qualityScore?: number
    format?: string
    pricingTier?: string
    pricePerEpisode?: number | null
    tags?: DatasetCreatetagsInput | string[]
    downloads?: number
    rating?: number
    accessLevel?: string
    licenseType?: string
    storageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DatasetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    task?: StringFieldUpdateOperationsInput | string
    embodiments?: DatasetUpdateembodimentsInput | string[]
    episodeCount?: IntFieldUpdateOperationsInput | number
    totalDurationHours?: FloatFieldUpdateOperationsInput | number
    sizeGb?: FloatFieldUpdateOperationsInput | number
    qualityScore?: FloatFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    pricingTier?: StringFieldUpdateOperationsInput | string
    pricePerEpisode?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: DatasetUpdatetagsInput | string[]
    downloads?: IntFieldUpdateOperationsInput | number
    rating?: FloatFieldUpdateOperationsInput | number
    accessLevel?: StringFieldUpdateOperationsInput | string
    licenseType?: StringFieldUpdateOperationsInput | string
    storageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DatasetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    task?: StringFieldUpdateOperationsInput | string
    embodiments?: DatasetUpdateembodimentsInput | string[]
    episodeCount?: IntFieldUpdateOperationsInput | number
    totalDurationHours?: FloatFieldUpdateOperationsInput | number
    sizeGb?: FloatFieldUpdateOperationsInput | number
    qualityScore?: FloatFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    pricingTier?: StringFieldUpdateOperationsInput | string
    pricePerEpisode?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: DatasetUpdatetagsInput | string[]
    downloads?: IntFieldUpdateOperationsInput | number
    rating?: FloatFieldUpdateOperationsInput | number
    accessLevel?: StringFieldUpdateOperationsInput | string
    licenseType?: StringFieldUpdateOperationsInput | string
    storageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewCreateInput = {
    id?: string
    userId: string
    userName: string
    rating: number
    comment: string
    createdAt?: Date | string
    dataset: DatasetCreateNestedOneWithoutReviewsInput
  }

  export type ReviewUncheckedCreateInput = {
    id?: string
    datasetId: string
    userId: string
    userName: string
    rating: number
    comment: string
    createdAt?: Date | string
  }

  export type ReviewUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    comment?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dataset?: DatasetUpdateOneRequiredWithoutReviewsNestedInput
  }

  export type ReviewUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    datasetId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    comment?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewCreateManyInput = {
    id?: string
    datasetId: string
    userId: string
    userName: string
    rating: number
    comment: string
    createdAt?: Date | string
  }

  export type ReviewUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    comment?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    datasetId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    comment?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseCreateInput = {
    id?: string
    userId: string
    amount: number
    currency?: string
    stripePaymentId?: string | null
    status?: string
    createdAt?: Date | string
    dataset: DatasetCreateNestedOneWithoutPurchasesInput
  }

  export type PurchaseUncheckedCreateInput = {
    id?: string
    userId: string
    datasetId: string
    amount: number
    currency?: string
    stripePaymentId?: string | null
    status?: string
    createdAt?: Date | string
  }

  export type PurchaseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dataset?: DatasetUpdateOneRequiredWithoutPurchasesNestedInput
  }

  export type PurchaseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    datasetId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseCreateManyInput = {
    id?: string
    userId: string
    datasetId: string
    amount: number
    currency?: string
    stripePaymentId?: string | null
    status?: string
    createdAt?: Date | string
  }

  export type PurchaseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    datasetId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemCreateInput = {
    id?: string
    userId: string
    addedAt?: Date | string
    dataset: DatasetCreateNestedOneWithoutCartItemsInput
  }

  export type CartItemUncheckedCreateInput = {
    id?: string
    userId: string
    datasetId: string
    addedAt?: Date | string
  }

  export type CartItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dataset?: DatasetUpdateOneRequiredWithoutCartItemsNestedInput
  }

  export type CartItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    datasetId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemCreateManyInput = {
    id?: string
    userId: string
    datasetId: string
    addedAt?: Date | string
  }

  export type CartItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    datasetId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProvenanceEventCreateInput = {
    id?: string
    actor: string
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    dataset: DatasetCreateNestedOneWithoutProvenanceInput
    parent?: ProvenanceEventCreateNestedOneWithoutChildrenInput
    children?: ProvenanceEventCreateNestedManyWithoutParentInput
  }

  export type ProvenanceEventUncheckedCreateInput = {
    id?: string
    datasetId: string
    actor: string
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    parentId?: string | null
    createdAt?: Date | string
    children?: ProvenanceEventUncheckedCreateNestedManyWithoutParentInput
  }

  export type ProvenanceEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dataset?: DatasetUpdateOneRequiredWithoutProvenanceNestedInput
    parent?: ProvenanceEventUpdateOneWithoutChildrenNestedInput
    children?: ProvenanceEventUpdateManyWithoutParentNestedInput
  }

  export type ProvenanceEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    datasetId?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: ProvenanceEventUncheckedUpdateManyWithoutParentNestedInput
  }

  export type ProvenanceEventCreateManyInput = {
    id?: string
    datasetId: string
    actor: string
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    parentId?: string | null
    createdAt?: Date | string
  }

  export type ProvenanceEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProvenanceEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    datasetId?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ReviewListRelationFilter = {
    every?: ReviewWhereInput
    some?: ReviewWhereInput
    none?: ReviewWhereInput
  }

  export type PurchaseListRelationFilter = {
    every?: PurchaseWhereInput
    some?: PurchaseWhereInput
    none?: PurchaseWhereInput
  }

  export type CartItemListRelationFilter = {
    every?: CartItemWhereInput
    some?: CartItemWhereInput
    none?: CartItemWhereInput
  }

  export type ProvenanceEventListRelationFilter = {
    every?: ProvenanceEventWhereInput
    some?: ProvenanceEventWhereInput
    none?: ProvenanceEventWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ReviewOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PurchaseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CartItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProvenanceEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DatasetCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    ownerId?: SortOrder
    task?: SortOrder
    embodiments?: SortOrder
    episodeCount?: SortOrder
    totalDurationHours?: SortOrder
    sizeGb?: SortOrder
    qualityScore?: SortOrder
    format?: SortOrder
    pricingTier?: SortOrder
    pricePerEpisode?: SortOrder
    tags?: SortOrder
    downloads?: SortOrder
    rating?: SortOrder
    accessLevel?: SortOrder
    licenseType?: SortOrder
    storageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DatasetAvgOrderByAggregateInput = {
    episodeCount?: SortOrder
    totalDurationHours?: SortOrder
    sizeGb?: SortOrder
    qualityScore?: SortOrder
    pricePerEpisode?: SortOrder
    downloads?: SortOrder
    rating?: SortOrder
  }

  export type DatasetMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    ownerId?: SortOrder
    task?: SortOrder
    episodeCount?: SortOrder
    totalDurationHours?: SortOrder
    sizeGb?: SortOrder
    qualityScore?: SortOrder
    format?: SortOrder
    pricingTier?: SortOrder
    pricePerEpisode?: SortOrder
    downloads?: SortOrder
    rating?: SortOrder
    accessLevel?: SortOrder
    licenseType?: SortOrder
    storageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DatasetMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    ownerId?: SortOrder
    task?: SortOrder
    episodeCount?: SortOrder
    totalDurationHours?: SortOrder
    sizeGb?: SortOrder
    qualityScore?: SortOrder
    format?: SortOrder
    pricingTier?: SortOrder
    pricePerEpisode?: SortOrder
    downloads?: SortOrder
    rating?: SortOrder
    accessLevel?: SortOrder
    licenseType?: SortOrder
    storageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DatasetSumOrderByAggregateInput = {
    episodeCount?: SortOrder
    totalDurationHours?: SortOrder
    sizeGb?: SortOrder
    qualityScore?: SortOrder
    pricePerEpisode?: SortOrder
    downloads?: SortOrder
    rating?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DatasetRelationFilter = {
    is?: DatasetWhereInput
    isNot?: DatasetWhereInput
  }

  export type ReviewDatasetIdUserIdCompoundUniqueInput = {
    datasetId: string
    userId: string
  }

  export type ReviewCountOrderByAggregateInput = {
    id?: SortOrder
    datasetId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    rating?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type ReviewAvgOrderByAggregateInput = {
    rating?: SortOrder
  }

  export type ReviewMaxOrderByAggregateInput = {
    id?: SortOrder
    datasetId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    rating?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type ReviewMinOrderByAggregateInput = {
    id?: SortOrder
    datasetId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    rating?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type ReviewSumOrderByAggregateInput = {
    rating?: SortOrder
  }

  export type PurchaseCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    datasetId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    stripePaymentId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type PurchaseAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type PurchaseMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    datasetId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    stripePaymentId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type PurchaseMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    datasetId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    stripePaymentId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type PurchaseSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type CartItemUserIdDatasetIdCompoundUniqueInput = {
    userId: string
    datasetId: string
  }

  export type CartItemCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    datasetId?: SortOrder
    addedAt?: SortOrder
  }

  export type CartItemMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    datasetId?: SortOrder
    addedAt?: SortOrder
  }

  export type CartItemMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    datasetId?: SortOrder
    addedAt?: SortOrder
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ProvenanceEventNullableRelationFilter = {
    is?: ProvenanceEventWhereInput | null
    isNot?: ProvenanceEventWhereInput | null
  }

  export type ProvenanceEventCountOrderByAggregateInput = {
    id?: SortOrder
    datasetId?: SortOrder
    actor?: SortOrder
    action?: SortOrder
    details?: SortOrder
    parentId?: SortOrder
    createdAt?: SortOrder
  }

  export type ProvenanceEventMaxOrderByAggregateInput = {
    id?: SortOrder
    datasetId?: SortOrder
    actor?: SortOrder
    action?: SortOrder
    parentId?: SortOrder
    createdAt?: SortOrder
  }

  export type ProvenanceEventMinOrderByAggregateInput = {
    id?: SortOrder
    datasetId?: SortOrder
    actor?: SortOrder
    action?: SortOrder
    parentId?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DatasetCreateembodimentsInput = {
    set: string[]
  }

  export type DatasetCreatetagsInput = {
    set: string[]
  }

  export type ReviewCreateNestedManyWithoutDatasetInput = {
    create?: XOR<ReviewCreateWithoutDatasetInput, ReviewUncheckedCreateWithoutDatasetInput> | ReviewCreateWithoutDatasetInput[] | ReviewUncheckedCreateWithoutDatasetInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutDatasetInput | ReviewCreateOrConnectWithoutDatasetInput[]
    createMany?: ReviewCreateManyDatasetInputEnvelope
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
  }

  export type PurchaseCreateNestedManyWithoutDatasetInput = {
    create?: XOR<PurchaseCreateWithoutDatasetInput, PurchaseUncheckedCreateWithoutDatasetInput> | PurchaseCreateWithoutDatasetInput[] | PurchaseUncheckedCreateWithoutDatasetInput[]
    connectOrCreate?: PurchaseCreateOrConnectWithoutDatasetInput | PurchaseCreateOrConnectWithoutDatasetInput[]
    createMany?: PurchaseCreateManyDatasetInputEnvelope
    connect?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
  }

  export type CartItemCreateNestedManyWithoutDatasetInput = {
    create?: XOR<CartItemCreateWithoutDatasetInput, CartItemUncheckedCreateWithoutDatasetInput> | CartItemCreateWithoutDatasetInput[] | CartItemUncheckedCreateWithoutDatasetInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutDatasetInput | CartItemCreateOrConnectWithoutDatasetInput[]
    createMany?: CartItemCreateManyDatasetInputEnvelope
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
  }

  export type ProvenanceEventCreateNestedManyWithoutDatasetInput = {
    create?: XOR<ProvenanceEventCreateWithoutDatasetInput, ProvenanceEventUncheckedCreateWithoutDatasetInput> | ProvenanceEventCreateWithoutDatasetInput[] | ProvenanceEventUncheckedCreateWithoutDatasetInput[]
    connectOrCreate?: ProvenanceEventCreateOrConnectWithoutDatasetInput | ProvenanceEventCreateOrConnectWithoutDatasetInput[]
    createMany?: ProvenanceEventCreateManyDatasetInputEnvelope
    connect?: ProvenanceEventWhereUniqueInput | ProvenanceEventWhereUniqueInput[]
  }

  export type ReviewUncheckedCreateNestedManyWithoutDatasetInput = {
    create?: XOR<ReviewCreateWithoutDatasetInput, ReviewUncheckedCreateWithoutDatasetInput> | ReviewCreateWithoutDatasetInput[] | ReviewUncheckedCreateWithoutDatasetInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutDatasetInput | ReviewCreateOrConnectWithoutDatasetInput[]
    createMany?: ReviewCreateManyDatasetInputEnvelope
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
  }

  export type PurchaseUncheckedCreateNestedManyWithoutDatasetInput = {
    create?: XOR<PurchaseCreateWithoutDatasetInput, PurchaseUncheckedCreateWithoutDatasetInput> | PurchaseCreateWithoutDatasetInput[] | PurchaseUncheckedCreateWithoutDatasetInput[]
    connectOrCreate?: PurchaseCreateOrConnectWithoutDatasetInput | PurchaseCreateOrConnectWithoutDatasetInput[]
    createMany?: PurchaseCreateManyDatasetInputEnvelope
    connect?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
  }

  export type CartItemUncheckedCreateNestedManyWithoutDatasetInput = {
    create?: XOR<CartItemCreateWithoutDatasetInput, CartItemUncheckedCreateWithoutDatasetInput> | CartItemCreateWithoutDatasetInput[] | CartItemUncheckedCreateWithoutDatasetInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutDatasetInput | CartItemCreateOrConnectWithoutDatasetInput[]
    createMany?: CartItemCreateManyDatasetInputEnvelope
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
  }

  export type ProvenanceEventUncheckedCreateNestedManyWithoutDatasetInput = {
    create?: XOR<ProvenanceEventCreateWithoutDatasetInput, ProvenanceEventUncheckedCreateWithoutDatasetInput> | ProvenanceEventCreateWithoutDatasetInput[] | ProvenanceEventUncheckedCreateWithoutDatasetInput[]
    connectOrCreate?: ProvenanceEventCreateOrConnectWithoutDatasetInput | ProvenanceEventCreateOrConnectWithoutDatasetInput[]
    createMany?: ProvenanceEventCreateManyDatasetInputEnvelope
    connect?: ProvenanceEventWhereUniqueInput | ProvenanceEventWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DatasetUpdateembodimentsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DatasetUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ReviewUpdateManyWithoutDatasetNestedInput = {
    create?: XOR<ReviewCreateWithoutDatasetInput, ReviewUncheckedCreateWithoutDatasetInput> | ReviewCreateWithoutDatasetInput[] | ReviewUncheckedCreateWithoutDatasetInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutDatasetInput | ReviewCreateOrConnectWithoutDatasetInput[]
    upsert?: ReviewUpsertWithWhereUniqueWithoutDatasetInput | ReviewUpsertWithWhereUniqueWithoutDatasetInput[]
    createMany?: ReviewCreateManyDatasetInputEnvelope
    set?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    disconnect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    delete?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    update?: ReviewUpdateWithWhereUniqueWithoutDatasetInput | ReviewUpdateWithWhereUniqueWithoutDatasetInput[]
    updateMany?: ReviewUpdateManyWithWhereWithoutDatasetInput | ReviewUpdateManyWithWhereWithoutDatasetInput[]
    deleteMany?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
  }

  export type PurchaseUpdateManyWithoutDatasetNestedInput = {
    create?: XOR<PurchaseCreateWithoutDatasetInput, PurchaseUncheckedCreateWithoutDatasetInput> | PurchaseCreateWithoutDatasetInput[] | PurchaseUncheckedCreateWithoutDatasetInput[]
    connectOrCreate?: PurchaseCreateOrConnectWithoutDatasetInput | PurchaseCreateOrConnectWithoutDatasetInput[]
    upsert?: PurchaseUpsertWithWhereUniqueWithoutDatasetInput | PurchaseUpsertWithWhereUniqueWithoutDatasetInput[]
    createMany?: PurchaseCreateManyDatasetInputEnvelope
    set?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
    disconnect?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
    delete?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
    connect?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
    update?: PurchaseUpdateWithWhereUniqueWithoutDatasetInput | PurchaseUpdateWithWhereUniqueWithoutDatasetInput[]
    updateMany?: PurchaseUpdateManyWithWhereWithoutDatasetInput | PurchaseUpdateManyWithWhereWithoutDatasetInput[]
    deleteMany?: PurchaseScalarWhereInput | PurchaseScalarWhereInput[]
  }

  export type CartItemUpdateManyWithoutDatasetNestedInput = {
    create?: XOR<CartItemCreateWithoutDatasetInput, CartItemUncheckedCreateWithoutDatasetInput> | CartItemCreateWithoutDatasetInput[] | CartItemUncheckedCreateWithoutDatasetInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutDatasetInput | CartItemCreateOrConnectWithoutDatasetInput[]
    upsert?: CartItemUpsertWithWhereUniqueWithoutDatasetInput | CartItemUpsertWithWhereUniqueWithoutDatasetInput[]
    createMany?: CartItemCreateManyDatasetInputEnvelope
    set?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    disconnect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    delete?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    update?: CartItemUpdateWithWhereUniqueWithoutDatasetInput | CartItemUpdateWithWhereUniqueWithoutDatasetInput[]
    updateMany?: CartItemUpdateManyWithWhereWithoutDatasetInput | CartItemUpdateManyWithWhereWithoutDatasetInput[]
    deleteMany?: CartItemScalarWhereInput | CartItemScalarWhereInput[]
  }

  export type ProvenanceEventUpdateManyWithoutDatasetNestedInput = {
    create?: XOR<ProvenanceEventCreateWithoutDatasetInput, ProvenanceEventUncheckedCreateWithoutDatasetInput> | ProvenanceEventCreateWithoutDatasetInput[] | ProvenanceEventUncheckedCreateWithoutDatasetInput[]
    connectOrCreate?: ProvenanceEventCreateOrConnectWithoutDatasetInput | ProvenanceEventCreateOrConnectWithoutDatasetInput[]
    upsert?: ProvenanceEventUpsertWithWhereUniqueWithoutDatasetInput | ProvenanceEventUpsertWithWhereUniqueWithoutDatasetInput[]
    createMany?: ProvenanceEventCreateManyDatasetInputEnvelope
    set?: ProvenanceEventWhereUniqueInput | ProvenanceEventWhereUniqueInput[]
    disconnect?: ProvenanceEventWhereUniqueInput | ProvenanceEventWhereUniqueInput[]
    delete?: ProvenanceEventWhereUniqueInput | ProvenanceEventWhereUniqueInput[]
    connect?: ProvenanceEventWhereUniqueInput | ProvenanceEventWhereUniqueInput[]
    update?: ProvenanceEventUpdateWithWhereUniqueWithoutDatasetInput | ProvenanceEventUpdateWithWhereUniqueWithoutDatasetInput[]
    updateMany?: ProvenanceEventUpdateManyWithWhereWithoutDatasetInput | ProvenanceEventUpdateManyWithWhereWithoutDatasetInput[]
    deleteMany?: ProvenanceEventScalarWhereInput | ProvenanceEventScalarWhereInput[]
  }

  export type ReviewUncheckedUpdateManyWithoutDatasetNestedInput = {
    create?: XOR<ReviewCreateWithoutDatasetInput, ReviewUncheckedCreateWithoutDatasetInput> | ReviewCreateWithoutDatasetInput[] | ReviewUncheckedCreateWithoutDatasetInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutDatasetInput | ReviewCreateOrConnectWithoutDatasetInput[]
    upsert?: ReviewUpsertWithWhereUniqueWithoutDatasetInput | ReviewUpsertWithWhereUniqueWithoutDatasetInput[]
    createMany?: ReviewCreateManyDatasetInputEnvelope
    set?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    disconnect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    delete?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    update?: ReviewUpdateWithWhereUniqueWithoutDatasetInput | ReviewUpdateWithWhereUniqueWithoutDatasetInput[]
    updateMany?: ReviewUpdateManyWithWhereWithoutDatasetInput | ReviewUpdateManyWithWhereWithoutDatasetInput[]
    deleteMany?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
  }

  export type PurchaseUncheckedUpdateManyWithoutDatasetNestedInput = {
    create?: XOR<PurchaseCreateWithoutDatasetInput, PurchaseUncheckedCreateWithoutDatasetInput> | PurchaseCreateWithoutDatasetInput[] | PurchaseUncheckedCreateWithoutDatasetInput[]
    connectOrCreate?: PurchaseCreateOrConnectWithoutDatasetInput | PurchaseCreateOrConnectWithoutDatasetInput[]
    upsert?: PurchaseUpsertWithWhereUniqueWithoutDatasetInput | PurchaseUpsertWithWhereUniqueWithoutDatasetInput[]
    createMany?: PurchaseCreateManyDatasetInputEnvelope
    set?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
    disconnect?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
    delete?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
    connect?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
    update?: PurchaseUpdateWithWhereUniqueWithoutDatasetInput | PurchaseUpdateWithWhereUniqueWithoutDatasetInput[]
    updateMany?: PurchaseUpdateManyWithWhereWithoutDatasetInput | PurchaseUpdateManyWithWhereWithoutDatasetInput[]
    deleteMany?: PurchaseScalarWhereInput | PurchaseScalarWhereInput[]
  }

  export type CartItemUncheckedUpdateManyWithoutDatasetNestedInput = {
    create?: XOR<CartItemCreateWithoutDatasetInput, CartItemUncheckedCreateWithoutDatasetInput> | CartItemCreateWithoutDatasetInput[] | CartItemUncheckedCreateWithoutDatasetInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutDatasetInput | CartItemCreateOrConnectWithoutDatasetInput[]
    upsert?: CartItemUpsertWithWhereUniqueWithoutDatasetInput | CartItemUpsertWithWhereUniqueWithoutDatasetInput[]
    createMany?: CartItemCreateManyDatasetInputEnvelope
    set?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    disconnect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    delete?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    update?: CartItemUpdateWithWhereUniqueWithoutDatasetInput | CartItemUpdateWithWhereUniqueWithoutDatasetInput[]
    updateMany?: CartItemUpdateManyWithWhereWithoutDatasetInput | CartItemUpdateManyWithWhereWithoutDatasetInput[]
    deleteMany?: CartItemScalarWhereInput | CartItemScalarWhereInput[]
  }

  export type ProvenanceEventUncheckedUpdateManyWithoutDatasetNestedInput = {
    create?: XOR<ProvenanceEventCreateWithoutDatasetInput, ProvenanceEventUncheckedCreateWithoutDatasetInput> | ProvenanceEventCreateWithoutDatasetInput[] | ProvenanceEventUncheckedCreateWithoutDatasetInput[]
    connectOrCreate?: ProvenanceEventCreateOrConnectWithoutDatasetInput | ProvenanceEventCreateOrConnectWithoutDatasetInput[]
    upsert?: ProvenanceEventUpsertWithWhereUniqueWithoutDatasetInput | ProvenanceEventUpsertWithWhereUniqueWithoutDatasetInput[]
    createMany?: ProvenanceEventCreateManyDatasetInputEnvelope
    set?: ProvenanceEventWhereUniqueInput | ProvenanceEventWhereUniqueInput[]
    disconnect?: ProvenanceEventWhereUniqueInput | ProvenanceEventWhereUniqueInput[]
    delete?: ProvenanceEventWhereUniqueInput | ProvenanceEventWhereUniqueInput[]
    connect?: ProvenanceEventWhereUniqueInput | ProvenanceEventWhereUniqueInput[]
    update?: ProvenanceEventUpdateWithWhereUniqueWithoutDatasetInput | ProvenanceEventUpdateWithWhereUniqueWithoutDatasetInput[]
    updateMany?: ProvenanceEventUpdateManyWithWhereWithoutDatasetInput | ProvenanceEventUpdateManyWithWhereWithoutDatasetInput[]
    deleteMany?: ProvenanceEventScalarWhereInput | ProvenanceEventScalarWhereInput[]
  }

  export type DatasetCreateNestedOneWithoutReviewsInput = {
    create?: XOR<DatasetCreateWithoutReviewsInput, DatasetUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: DatasetCreateOrConnectWithoutReviewsInput
    connect?: DatasetWhereUniqueInput
  }

  export type DatasetUpdateOneRequiredWithoutReviewsNestedInput = {
    create?: XOR<DatasetCreateWithoutReviewsInput, DatasetUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: DatasetCreateOrConnectWithoutReviewsInput
    upsert?: DatasetUpsertWithoutReviewsInput
    connect?: DatasetWhereUniqueInput
    update?: XOR<XOR<DatasetUpdateToOneWithWhereWithoutReviewsInput, DatasetUpdateWithoutReviewsInput>, DatasetUncheckedUpdateWithoutReviewsInput>
  }

  export type DatasetCreateNestedOneWithoutPurchasesInput = {
    create?: XOR<DatasetCreateWithoutPurchasesInput, DatasetUncheckedCreateWithoutPurchasesInput>
    connectOrCreate?: DatasetCreateOrConnectWithoutPurchasesInput
    connect?: DatasetWhereUniqueInput
  }

  export type DatasetUpdateOneRequiredWithoutPurchasesNestedInput = {
    create?: XOR<DatasetCreateWithoutPurchasesInput, DatasetUncheckedCreateWithoutPurchasesInput>
    connectOrCreate?: DatasetCreateOrConnectWithoutPurchasesInput
    upsert?: DatasetUpsertWithoutPurchasesInput
    connect?: DatasetWhereUniqueInput
    update?: XOR<XOR<DatasetUpdateToOneWithWhereWithoutPurchasesInput, DatasetUpdateWithoutPurchasesInput>, DatasetUncheckedUpdateWithoutPurchasesInput>
  }

  export type DatasetCreateNestedOneWithoutCartItemsInput = {
    create?: XOR<DatasetCreateWithoutCartItemsInput, DatasetUncheckedCreateWithoutCartItemsInput>
    connectOrCreate?: DatasetCreateOrConnectWithoutCartItemsInput
    connect?: DatasetWhereUniqueInput
  }

  export type DatasetUpdateOneRequiredWithoutCartItemsNestedInput = {
    create?: XOR<DatasetCreateWithoutCartItemsInput, DatasetUncheckedCreateWithoutCartItemsInput>
    connectOrCreate?: DatasetCreateOrConnectWithoutCartItemsInput
    upsert?: DatasetUpsertWithoutCartItemsInput
    connect?: DatasetWhereUniqueInput
    update?: XOR<XOR<DatasetUpdateToOneWithWhereWithoutCartItemsInput, DatasetUpdateWithoutCartItemsInput>, DatasetUncheckedUpdateWithoutCartItemsInput>
  }

  export type DatasetCreateNestedOneWithoutProvenanceInput = {
    create?: XOR<DatasetCreateWithoutProvenanceInput, DatasetUncheckedCreateWithoutProvenanceInput>
    connectOrCreate?: DatasetCreateOrConnectWithoutProvenanceInput
    connect?: DatasetWhereUniqueInput
  }

  export type ProvenanceEventCreateNestedOneWithoutChildrenInput = {
    create?: XOR<ProvenanceEventCreateWithoutChildrenInput, ProvenanceEventUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: ProvenanceEventCreateOrConnectWithoutChildrenInput
    connect?: ProvenanceEventWhereUniqueInput
  }

  export type ProvenanceEventCreateNestedManyWithoutParentInput = {
    create?: XOR<ProvenanceEventCreateWithoutParentInput, ProvenanceEventUncheckedCreateWithoutParentInput> | ProvenanceEventCreateWithoutParentInput[] | ProvenanceEventUncheckedCreateWithoutParentInput[]
    connectOrCreate?: ProvenanceEventCreateOrConnectWithoutParentInput | ProvenanceEventCreateOrConnectWithoutParentInput[]
    createMany?: ProvenanceEventCreateManyParentInputEnvelope
    connect?: ProvenanceEventWhereUniqueInput | ProvenanceEventWhereUniqueInput[]
  }

  export type ProvenanceEventUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<ProvenanceEventCreateWithoutParentInput, ProvenanceEventUncheckedCreateWithoutParentInput> | ProvenanceEventCreateWithoutParentInput[] | ProvenanceEventUncheckedCreateWithoutParentInput[]
    connectOrCreate?: ProvenanceEventCreateOrConnectWithoutParentInput | ProvenanceEventCreateOrConnectWithoutParentInput[]
    createMany?: ProvenanceEventCreateManyParentInputEnvelope
    connect?: ProvenanceEventWhereUniqueInput | ProvenanceEventWhereUniqueInput[]
  }

  export type DatasetUpdateOneRequiredWithoutProvenanceNestedInput = {
    create?: XOR<DatasetCreateWithoutProvenanceInput, DatasetUncheckedCreateWithoutProvenanceInput>
    connectOrCreate?: DatasetCreateOrConnectWithoutProvenanceInput
    upsert?: DatasetUpsertWithoutProvenanceInput
    connect?: DatasetWhereUniqueInput
    update?: XOR<XOR<DatasetUpdateToOneWithWhereWithoutProvenanceInput, DatasetUpdateWithoutProvenanceInput>, DatasetUncheckedUpdateWithoutProvenanceInput>
  }

  export type ProvenanceEventUpdateOneWithoutChildrenNestedInput = {
    create?: XOR<ProvenanceEventCreateWithoutChildrenInput, ProvenanceEventUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: ProvenanceEventCreateOrConnectWithoutChildrenInput
    upsert?: ProvenanceEventUpsertWithoutChildrenInput
    disconnect?: ProvenanceEventWhereInput | boolean
    delete?: ProvenanceEventWhereInput | boolean
    connect?: ProvenanceEventWhereUniqueInput
    update?: XOR<XOR<ProvenanceEventUpdateToOneWithWhereWithoutChildrenInput, ProvenanceEventUpdateWithoutChildrenInput>, ProvenanceEventUncheckedUpdateWithoutChildrenInput>
  }

  export type ProvenanceEventUpdateManyWithoutParentNestedInput = {
    create?: XOR<ProvenanceEventCreateWithoutParentInput, ProvenanceEventUncheckedCreateWithoutParentInput> | ProvenanceEventCreateWithoutParentInput[] | ProvenanceEventUncheckedCreateWithoutParentInput[]
    connectOrCreate?: ProvenanceEventCreateOrConnectWithoutParentInput | ProvenanceEventCreateOrConnectWithoutParentInput[]
    upsert?: ProvenanceEventUpsertWithWhereUniqueWithoutParentInput | ProvenanceEventUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: ProvenanceEventCreateManyParentInputEnvelope
    set?: ProvenanceEventWhereUniqueInput | ProvenanceEventWhereUniqueInput[]
    disconnect?: ProvenanceEventWhereUniqueInput | ProvenanceEventWhereUniqueInput[]
    delete?: ProvenanceEventWhereUniqueInput | ProvenanceEventWhereUniqueInput[]
    connect?: ProvenanceEventWhereUniqueInput | ProvenanceEventWhereUniqueInput[]
    update?: ProvenanceEventUpdateWithWhereUniqueWithoutParentInput | ProvenanceEventUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: ProvenanceEventUpdateManyWithWhereWithoutParentInput | ProvenanceEventUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: ProvenanceEventScalarWhereInput | ProvenanceEventScalarWhereInput[]
  }

  export type ProvenanceEventUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<ProvenanceEventCreateWithoutParentInput, ProvenanceEventUncheckedCreateWithoutParentInput> | ProvenanceEventCreateWithoutParentInput[] | ProvenanceEventUncheckedCreateWithoutParentInput[]
    connectOrCreate?: ProvenanceEventCreateOrConnectWithoutParentInput | ProvenanceEventCreateOrConnectWithoutParentInput[]
    upsert?: ProvenanceEventUpsertWithWhereUniqueWithoutParentInput | ProvenanceEventUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: ProvenanceEventCreateManyParentInputEnvelope
    set?: ProvenanceEventWhereUniqueInput | ProvenanceEventWhereUniqueInput[]
    disconnect?: ProvenanceEventWhereUniqueInput | ProvenanceEventWhereUniqueInput[]
    delete?: ProvenanceEventWhereUniqueInput | ProvenanceEventWhereUniqueInput[]
    connect?: ProvenanceEventWhereUniqueInput | ProvenanceEventWhereUniqueInput[]
    update?: ProvenanceEventUpdateWithWhereUniqueWithoutParentInput | ProvenanceEventUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: ProvenanceEventUpdateManyWithWhereWithoutParentInput | ProvenanceEventUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: ProvenanceEventScalarWhereInput | ProvenanceEventScalarWhereInput[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ReviewCreateWithoutDatasetInput = {
    id?: string
    userId: string
    userName: string
    rating: number
    comment: string
    createdAt?: Date | string
  }

  export type ReviewUncheckedCreateWithoutDatasetInput = {
    id?: string
    userId: string
    userName: string
    rating: number
    comment: string
    createdAt?: Date | string
  }

  export type ReviewCreateOrConnectWithoutDatasetInput = {
    where: ReviewWhereUniqueInput
    create: XOR<ReviewCreateWithoutDatasetInput, ReviewUncheckedCreateWithoutDatasetInput>
  }

  export type ReviewCreateManyDatasetInputEnvelope = {
    data: ReviewCreateManyDatasetInput | ReviewCreateManyDatasetInput[]
    skipDuplicates?: boolean
  }

  export type PurchaseCreateWithoutDatasetInput = {
    id?: string
    userId: string
    amount: number
    currency?: string
    stripePaymentId?: string | null
    status?: string
    createdAt?: Date | string
  }

  export type PurchaseUncheckedCreateWithoutDatasetInput = {
    id?: string
    userId: string
    amount: number
    currency?: string
    stripePaymentId?: string | null
    status?: string
    createdAt?: Date | string
  }

  export type PurchaseCreateOrConnectWithoutDatasetInput = {
    where: PurchaseWhereUniqueInput
    create: XOR<PurchaseCreateWithoutDatasetInput, PurchaseUncheckedCreateWithoutDatasetInput>
  }

  export type PurchaseCreateManyDatasetInputEnvelope = {
    data: PurchaseCreateManyDatasetInput | PurchaseCreateManyDatasetInput[]
    skipDuplicates?: boolean
  }

  export type CartItemCreateWithoutDatasetInput = {
    id?: string
    userId: string
    addedAt?: Date | string
  }

  export type CartItemUncheckedCreateWithoutDatasetInput = {
    id?: string
    userId: string
    addedAt?: Date | string
  }

  export type CartItemCreateOrConnectWithoutDatasetInput = {
    where: CartItemWhereUniqueInput
    create: XOR<CartItemCreateWithoutDatasetInput, CartItemUncheckedCreateWithoutDatasetInput>
  }

  export type CartItemCreateManyDatasetInputEnvelope = {
    data: CartItemCreateManyDatasetInput | CartItemCreateManyDatasetInput[]
    skipDuplicates?: boolean
  }

  export type ProvenanceEventCreateWithoutDatasetInput = {
    id?: string
    actor: string
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    parent?: ProvenanceEventCreateNestedOneWithoutChildrenInput
    children?: ProvenanceEventCreateNestedManyWithoutParentInput
  }

  export type ProvenanceEventUncheckedCreateWithoutDatasetInput = {
    id?: string
    actor: string
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    parentId?: string | null
    createdAt?: Date | string
    children?: ProvenanceEventUncheckedCreateNestedManyWithoutParentInput
  }

  export type ProvenanceEventCreateOrConnectWithoutDatasetInput = {
    where: ProvenanceEventWhereUniqueInput
    create: XOR<ProvenanceEventCreateWithoutDatasetInput, ProvenanceEventUncheckedCreateWithoutDatasetInput>
  }

  export type ProvenanceEventCreateManyDatasetInputEnvelope = {
    data: ProvenanceEventCreateManyDatasetInput | ProvenanceEventCreateManyDatasetInput[]
    skipDuplicates?: boolean
  }

  export type ReviewUpsertWithWhereUniqueWithoutDatasetInput = {
    where: ReviewWhereUniqueInput
    update: XOR<ReviewUpdateWithoutDatasetInput, ReviewUncheckedUpdateWithoutDatasetInput>
    create: XOR<ReviewCreateWithoutDatasetInput, ReviewUncheckedCreateWithoutDatasetInput>
  }

  export type ReviewUpdateWithWhereUniqueWithoutDatasetInput = {
    where: ReviewWhereUniqueInput
    data: XOR<ReviewUpdateWithoutDatasetInput, ReviewUncheckedUpdateWithoutDatasetInput>
  }

  export type ReviewUpdateManyWithWhereWithoutDatasetInput = {
    where: ReviewScalarWhereInput
    data: XOR<ReviewUpdateManyMutationInput, ReviewUncheckedUpdateManyWithoutDatasetInput>
  }

  export type ReviewScalarWhereInput = {
    AND?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
    OR?: ReviewScalarWhereInput[]
    NOT?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
    id?: StringFilter<"Review"> | string
    datasetId?: StringFilter<"Review"> | string
    userId?: StringFilter<"Review"> | string
    userName?: StringFilter<"Review"> | string
    rating?: IntFilter<"Review"> | number
    comment?: StringFilter<"Review"> | string
    createdAt?: DateTimeFilter<"Review"> | Date | string
  }

  export type PurchaseUpsertWithWhereUniqueWithoutDatasetInput = {
    where: PurchaseWhereUniqueInput
    update: XOR<PurchaseUpdateWithoutDatasetInput, PurchaseUncheckedUpdateWithoutDatasetInput>
    create: XOR<PurchaseCreateWithoutDatasetInput, PurchaseUncheckedCreateWithoutDatasetInput>
  }

  export type PurchaseUpdateWithWhereUniqueWithoutDatasetInput = {
    where: PurchaseWhereUniqueInput
    data: XOR<PurchaseUpdateWithoutDatasetInput, PurchaseUncheckedUpdateWithoutDatasetInput>
  }

  export type PurchaseUpdateManyWithWhereWithoutDatasetInput = {
    where: PurchaseScalarWhereInput
    data: XOR<PurchaseUpdateManyMutationInput, PurchaseUncheckedUpdateManyWithoutDatasetInput>
  }

  export type PurchaseScalarWhereInput = {
    AND?: PurchaseScalarWhereInput | PurchaseScalarWhereInput[]
    OR?: PurchaseScalarWhereInput[]
    NOT?: PurchaseScalarWhereInput | PurchaseScalarWhereInput[]
    id?: StringFilter<"Purchase"> | string
    userId?: StringFilter<"Purchase"> | string
    datasetId?: StringFilter<"Purchase"> | string
    amount?: IntFilter<"Purchase"> | number
    currency?: StringFilter<"Purchase"> | string
    stripePaymentId?: StringNullableFilter<"Purchase"> | string | null
    status?: StringFilter<"Purchase"> | string
    createdAt?: DateTimeFilter<"Purchase"> | Date | string
  }

  export type CartItemUpsertWithWhereUniqueWithoutDatasetInput = {
    where: CartItemWhereUniqueInput
    update: XOR<CartItemUpdateWithoutDatasetInput, CartItemUncheckedUpdateWithoutDatasetInput>
    create: XOR<CartItemCreateWithoutDatasetInput, CartItemUncheckedCreateWithoutDatasetInput>
  }

  export type CartItemUpdateWithWhereUniqueWithoutDatasetInput = {
    where: CartItemWhereUniqueInput
    data: XOR<CartItemUpdateWithoutDatasetInput, CartItemUncheckedUpdateWithoutDatasetInput>
  }

  export type CartItemUpdateManyWithWhereWithoutDatasetInput = {
    where: CartItemScalarWhereInput
    data: XOR<CartItemUpdateManyMutationInput, CartItemUncheckedUpdateManyWithoutDatasetInput>
  }

  export type CartItemScalarWhereInput = {
    AND?: CartItemScalarWhereInput | CartItemScalarWhereInput[]
    OR?: CartItemScalarWhereInput[]
    NOT?: CartItemScalarWhereInput | CartItemScalarWhereInput[]
    id?: StringFilter<"CartItem"> | string
    userId?: StringFilter<"CartItem"> | string
    datasetId?: StringFilter<"CartItem"> | string
    addedAt?: DateTimeFilter<"CartItem"> | Date | string
  }

  export type ProvenanceEventUpsertWithWhereUniqueWithoutDatasetInput = {
    where: ProvenanceEventWhereUniqueInput
    update: XOR<ProvenanceEventUpdateWithoutDatasetInput, ProvenanceEventUncheckedUpdateWithoutDatasetInput>
    create: XOR<ProvenanceEventCreateWithoutDatasetInput, ProvenanceEventUncheckedCreateWithoutDatasetInput>
  }

  export type ProvenanceEventUpdateWithWhereUniqueWithoutDatasetInput = {
    where: ProvenanceEventWhereUniqueInput
    data: XOR<ProvenanceEventUpdateWithoutDatasetInput, ProvenanceEventUncheckedUpdateWithoutDatasetInput>
  }

  export type ProvenanceEventUpdateManyWithWhereWithoutDatasetInput = {
    where: ProvenanceEventScalarWhereInput
    data: XOR<ProvenanceEventUpdateManyMutationInput, ProvenanceEventUncheckedUpdateManyWithoutDatasetInput>
  }

  export type ProvenanceEventScalarWhereInput = {
    AND?: ProvenanceEventScalarWhereInput | ProvenanceEventScalarWhereInput[]
    OR?: ProvenanceEventScalarWhereInput[]
    NOT?: ProvenanceEventScalarWhereInput | ProvenanceEventScalarWhereInput[]
    id?: StringFilter<"ProvenanceEvent"> | string
    datasetId?: StringFilter<"ProvenanceEvent"> | string
    actor?: StringFilter<"ProvenanceEvent"> | string
    action?: StringFilter<"ProvenanceEvent"> | string
    details?: JsonNullableFilter<"ProvenanceEvent">
    parentId?: StringNullableFilter<"ProvenanceEvent"> | string | null
    createdAt?: DateTimeFilter<"ProvenanceEvent"> | Date | string
  }

  export type DatasetCreateWithoutReviewsInput = {
    id?: string
    name: string
    description: string
    ownerId: string
    task: string
    embodiments?: DatasetCreateembodimentsInput | string[]
    episodeCount?: number
    totalDurationHours?: number
    sizeGb?: number
    qualityScore?: number
    format?: string
    pricingTier?: string
    pricePerEpisode?: number | null
    tags?: DatasetCreatetagsInput | string[]
    downloads?: number
    rating?: number
    accessLevel?: string
    licenseType?: string
    storageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    purchases?: PurchaseCreateNestedManyWithoutDatasetInput
    cartItems?: CartItemCreateNestedManyWithoutDatasetInput
    provenance?: ProvenanceEventCreateNestedManyWithoutDatasetInput
  }

  export type DatasetUncheckedCreateWithoutReviewsInput = {
    id?: string
    name: string
    description: string
    ownerId: string
    task: string
    embodiments?: DatasetCreateembodimentsInput | string[]
    episodeCount?: number
    totalDurationHours?: number
    sizeGb?: number
    qualityScore?: number
    format?: string
    pricingTier?: string
    pricePerEpisode?: number | null
    tags?: DatasetCreatetagsInput | string[]
    downloads?: number
    rating?: number
    accessLevel?: string
    licenseType?: string
    storageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    purchases?: PurchaseUncheckedCreateNestedManyWithoutDatasetInput
    cartItems?: CartItemUncheckedCreateNestedManyWithoutDatasetInput
    provenance?: ProvenanceEventUncheckedCreateNestedManyWithoutDatasetInput
  }

  export type DatasetCreateOrConnectWithoutReviewsInput = {
    where: DatasetWhereUniqueInput
    create: XOR<DatasetCreateWithoutReviewsInput, DatasetUncheckedCreateWithoutReviewsInput>
  }

  export type DatasetUpsertWithoutReviewsInput = {
    update: XOR<DatasetUpdateWithoutReviewsInput, DatasetUncheckedUpdateWithoutReviewsInput>
    create: XOR<DatasetCreateWithoutReviewsInput, DatasetUncheckedCreateWithoutReviewsInput>
    where?: DatasetWhereInput
  }

  export type DatasetUpdateToOneWithWhereWithoutReviewsInput = {
    where?: DatasetWhereInput
    data: XOR<DatasetUpdateWithoutReviewsInput, DatasetUncheckedUpdateWithoutReviewsInput>
  }

  export type DatasetUpdateWithoutReviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    task?: StringFieldUpdateOperationsInput | string
    embodiments?: DatasetUpdateembodimentsInput | string[]
    episodeCount?: IntFieldUpdateOperationsInput | number
    totalDurationHours?: FloatFieldUpdateOperationsInput | number
    sizeGb?: FloatFieldUpdateOperationsInput | number
    qualityScore?: FloatFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    pricingTier?: StringFieldUpdateOperationsInput | string
    pricePerEpisode?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: DatasetUpdatetagsInput | string[]
    downloads?: IntFieldUpdateOperationsInput | number
    rating?: FloatFieldUpdateOperationsInput | number
    accessLevel?: StringFieldUpdateOperationsInput | string
    licenseType?: StringFieldUpdateOperationsInput | string
    storageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    purchases?: PurchaseUpdateManyWithoutDatasetNestedInput
    cartItems?: CartItemUpdateManyWithoutDatasetNestedInput
    provenance?: ProvenanceEventUpdateManyWithoutDatasetNestedInput
  }

  export type DatasetUncheckedUpdateWithoutReviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    task?: StringFieldUpdateOperationsInput | string
    embodiments?: DatasetUpdateembodimentsInput | string[]
    episodeCount?: IntFieldUpdateOperationsInput | number
    totalDurationHours?: FloatFieldUpdateOperationsInput | number
    sizeGb?: FloatFieldUpdateOperationsInput | number
    qualityScore?: FloatFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    pricingTier?: StringFieldUpdateOperationsInput | string
    pricePerEpisode?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: DatasetUpdatetagsInput | string[]
    downloads?: IntFieldUpdateOperationsInput | number
    rating?: FloatFieldUpdateOperationsInput | number
    accessLevel?: StringFieldUpdateOperationsInput | string
    licenseType?: StringFieldUpdateOperationsInput | string
    storageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    purchases?: PurchaseUncheckedUpdateManyWithoutDatasetNestedInput
    cartItems?: CartItemUncheckedUpdateManyWithoutDatasetNestedInput
    provenance?: ProvenanceEventUncheckedUpdateManyWithoutDatasetNestedInput
  }

  export type DatasetCreateWithoutPurchasesInput = {
    id?: string
    name: string
    description: string
    ownerId: string
    task: string
    embodiments?: DatasetCreateembodimentsInput | string[]
    episodeCount?: number
    totalDurationHours?: number
    sizeGb?: number
    qualityScore?: number
    format?: string
    pricingTier?: string
    pricePerEpisode?: number | null
    tags?: DatasetCreatetagsInput | string[]
    downloads?: number
    rating?: number
    accessLevel?: string
    licenseType?: string
    storageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviews?: ReviewCreateNestedManyWithoutDatasetInput
    cartItems?: CartItemCreateNestedManyWithoutDatasetInput
    provenance?: ProvenanceEventCreateNestedManyWithoutDatasetInput
  }

  export type DatasetUncheckedCreateWithoutPurchasesInput = {
    id?: string
    name: string
    description: string
    ownerId: string
    task: string
    embodiments?: DatasetCreateembodimentsInput | string[]
    episodeCount?: number
    totalDurationHours?: number
    sizeGb?: number
    qualityScore?: number
    format?: string
    pricingTier?: string
    pricePerEpisode?: number | null
    tags?: DatasetCreatetagsInput | string[]
    downloads?: number
    rating?: number
    accessLevel?: string
    licenseType?: string
    storageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviews?: ReviewUncheckedCreateNestedManyWithoutDatasetInput
    cartItems?: CartItemUncheckedCreateNestedManyWithoutDatasetInput
    provenance?: ProvenanceEventUncheckedCreateNestedManyWithoutDatasetInput
  }

  export type DatasetCreateOrConnectWithoutPurchasesInput = {
    where: DatasetWhereUniqueInput
    create: XOR<DatasetCreateWithoutPurchasesInput, DatasetUncheckedCreateWithoutPurchasesInput>
  }

  export type DatasetUpsertWithoutPurchasesInput = {
    update: XOR<DatasetUpdateWithoutPurchasesInput, DatasetUncheckedUpdateWithoutPurchasesInput>
    create: XOR<DatasetCreateWithoutPurchasesInput, DatasetUncheckedCreateWithoutPurchasesInput>
    where?: DatasetWhereInput
  }

  export type DatasetUpdateToOneWithWhereWithoutPurchasesInput = {
    where?: DatasetWhereInput
    data: XOR<DatasetUpdateWithoutPurchasesInput, DatasetUncheckedUpdateWithoutPurchasesInput>
  }

  export type DatasetUpdateWithoutPurchasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    task?: StringFieldUpdateOperationsInput | string
    embodiments?: DatasetUpdateembodimentsInput | string[]
    episodeCount?: IntFieldUpdateOperationsInput | number
    totalDurationHours?: FloatFieldUpdateOperationsInput | number
    sizeGb?: FloatFieldUpdateOperationsInput | number
    qualityScore?: FloatFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    pricingTier?: StringFieldUpdateOperationsInput | string
    pricePerEpisode?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: DatasetUpdatetagsInput | string[]
    downloads?: IntFieldUpdateOperationsInput | number
    rating?: FloatFieldUpdateOperationsInput | number
    accessLevel?: StringFieldUpdateOperationsInput | string
    licenseType?: StringFieldUpdateOperationsInput | string
    storageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviews?: ReviewUpdateManyWithoutDatasetNestedInput
    cartItems?: CartItemUpdateManyWithoutDatasetNestedInput
    provenance?: ProvenanceEventUpdateManyWithoutDatasetNestedInput
  }

  export type DatasetUncheckedUpdateWithoutPurchasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    task?: StringFieldUpdateOperationsInput | string
    embodiments?: DatasetUpdateembodimentsInput | string[]
    episodeCount?: IntFieldUpdateOperationsInput | number
    totalDurationHours?: FloatFieldUpdateOperationsInput | number
    sizeGb?: FloatFieldUpdateOperationsInput | number
    qualityScore?: FloatFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    pricingTier?: StringFieldUpdateOperationsInput | string
    pricePerEpisode?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: DatasetUpdatetagsInput | string[]
    downloads?: IntFieldUpdateOperationsInput | number
    rating?: FloatFieldUpdateOperationsInput | number
    accessLevel?: StringFieldUpdateOperationsInput | string
    licenseType?: StringFieldUpdateOperationsInput | string
    storageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviews?: ReviewUncheckedUpdateManyWithoutDatasetNestedInput
    cartItems?: CartItemUncheckedUpdateManyWithoutDatasetNestedInput
    provenance?: ProvenanceEventUncheckedUpdateManyWithoutDatasetNestedInput
  }

  export type DatasetCreateWithoutCartItemsInput = {
    id?: string
    name: string
    description: string
    ownerId: string
    task: string
    embodiments?: DatasetCreateembodimentsInput | string[]
    episodeCount?: number
    totalDurationHours?: number
    sizeGb?: number
    qualityScore?: number
    format?: string
    pricingTier?: string
    pricePerEpisode?: number | null
    tags?: DatasetCreatetagsInput | string[]
    downloads?: number
    rating?: number
    accessLevel?: string
    licenseType?: string
    storageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviews?: ReviewCreateNestedManyWithoutDatasetInput
    purchases?: PurchaseCreateNestedManyWithoutDatasetInput
    provenance?: ProvenanceEventCreateNestedManyWithoutDatasetInput
  }

  export type DatasetUncheckedCreateWithoutCartItemsInput = {
    id?: string
    name: string
    description: string
    ownerId: string
    task: string
    embodiments?: DatasetCreateembodimentsInput | string[]
    episodeCount?: number
    totalDurationHours?: number
    sizeGb?: number
    qualityScore?: number
    format?: string
    pricingTier?: string
    pricePerEpisode?: number | null
    tags?: DatasetCreatetagsInput | string[]
    downloads?: number
    rating?: number
    accessLevel?: string
    licenseType?: string
    storageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviews?: ReviewUncheckedCreateNestedManyWithoutDatasetInput
    purchases?: PurchaseUncheckedCreateNestedManyWithoutDatasetInput
    provenance?: ProvenanceEventUncheckedCreateNestedManyWithoutDatasetInput
  }

  export type DatasetCreateOrConnectWithoutCartItemsInput = {
    where: DatasetWhereUniqueInput
    create: XOR<DatasetCreateWithoutCartItemsInput, DatasetUncheckedCreateWithoutCartItemsInput>
  }

  export type DatasetUpsertWithoutCartItemsInput = {
    update: XOR<DatasetUpdateWithoutCartItemsInput, DatasetUncheckedUpdateWithoutCartItemsInput>
    create: XOR<DatasetCreateWithoutCartItemsInput, DatasetUncheckedCreateWithoutCartItemsInput>
    where?: DatasetWhereInput
  }

  export type DatasetUpdateToOneWithWhereWithoutCartItemsInput = {
    where?: DatasetWhereInput
    data: XOR<DatasetUpdateWithoutCartItemsInput, DatasetUncheckedUpdateWithoutCartItemsInput>
  }

  export type DatasetUpdateWithoutCartItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    task?: StringFieldUpdateOperationsInput | string
    embodiments?: DatasetUpdateembodimentsInput | string[]
    episodeCount?: IntFieldUpdateOperationsInput | number
    totalDurationHours?: FloatFieldUpdateOperationsInput | number
    sizeGb?: FloatFieldUpdateOperationsInput | number
    qualityScore?: FloatFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    pricingTier?: StringFieldUpdateOperationsInput | string
    pricePerEpisode?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: DatasetUpdatetagsInput | string[]
    downloads?: IntFieldUpdateOperationsInput | number
    rating?: FloatFieldUpdateOperationsInput | number
    accessLevel?: StringFieldUpdateOperationsInput | string
    licenseType?: StringFieldUpdateOperationsInput | string
    storageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviews?: ReviewUpdateManyWithoutDatasetNestedInput
    purchases?: PurchaseUpdateManyWithoutDatasetNestedInput
    provenance?: ProvenanceEventUpdateManyWithoutDatasetNestedInput
  }

  export type DatasetUncheckedUpdateWithoutCartItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    task?: StringFieldUpdateOperationsInput | string
    embodiments?: DatasetUpdateembodimentsInput | string[]
    episodeCount?: IntFieldUpdateOperationsInput | number
    totalDurationHours?: FloatFieldUpdateOperationsInput | number
    sizeGb?: FloatFieldUpdateOperationsInput | number
    qualityScore?: FloatFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    pricingTier?: StringFieldUpdateOperationsInput | string
    pricePerEpisode?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: DatasetUpdatetagsInput | string[]
    downloads?: IntFieldUpdateOperationsInput | number
    rating?: FloatFieldUpdateOperationsInput | number
    accessLevel?: StringFieldUpdateOperationsInput | string
    licenseType?: StringFieldUpdateOperationsInput | string
    storageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviews?: ReviewUncheckedUpdateManyWithoutDatasetNestedInput
    purchases?: PurchaseUncheckedUpdateManyWithoutDatasetNestedInput
    provenance?: ProvenanceEventUncheckedUpdateManyWithoutDatasetNestedInput
  }

  export type DatasetCreateWithoutProvenanceInput = {
    id?: string
    name: string
    description: string
    ownerId: string
    task: string
    embodiments?: DatasetCreateembodimentsInput | string[]
    episodeCount?: number
    totalDurationHours?: number
    sizeGb?: number
    qualityScore?: number
    format?: string
    pricingTier?: string
    pricePerEpisode?: number | null
    tags?: DatasetCreatetagsInput | string[]
    downloads?: number
    rating?: number
    accessLevel?: string
    licenseType?: string
    storageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviews?: ReviewCreateNestedManyWithoutDatasetInput
    purchases?: PurchaseCreateNestedManyWithoutDatasetInput
    cartItems?: CartItemCreateNestedManyWithoutDatasetInput
  }

  export type DatasetUncheckedCreateWithoutProvenanceInput = {
    id?: string
    name: string
    description: string
    ownerId: string
    task: string
    embodiments?: DatasetCreateembodimentsInput | string[]
    episodeCount?: number
    totalDurationHours?: number
    sizeGb?: number
    qualityScore?: number
    format?: string
    pricingTier?: string
    pricePerEpisode?: number | null
    tags?: DatasetCreatetagsInput | string[]
    downloads?: number
    rating?: number
    accessLevel?: string
    licenseType?: string
    storageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviews?: ReviewUncheckedCreateNestedManyWithoutDatasetInput
    purchases?: PurchaseUncheckedCreateNestedManyWithoutDatasetInput
    cartItems?: CartItemUncheckedCreateNestedManyWithoutDatasetInput
  }

  export type DatasetCreateOrConnectWithoutProvenanceInput = {
    where: DatasetWhereUniqueInput
    create: XOR<DatasetCreateWithoutProvenanceInput, DatasetUncheckedCreateWithoutProvenanceInput>
  }

  export type ProvenanceEventCreateWithoutChildrenInput = {
    id?: string
    actor: string
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    dataset: DatasetCreateNestedOneWithoutProvenanceInput
    parent?: ProvenanceEventCreateNestedOneWithoutChildrenInput
  }

  export type ProvenanceEventUncheckedCreateWithoutChildrenInput = {
    id?: string
    datasetId: string
    actor: string
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    parentId?: string | null
    createdAt?: Date | string
  }

  export type ProvenanceEventCreateOrConnectWithoutChildrenInput = {
    where: ProvenanceEventWhereUniqueInput
    create: XOR<ProvenanceEventCreateWithoutChildrenInput, ProvenanceEventUncheckedCreateWithoutChildrenInput>
  }

  export type ProvenanceEventCreateWithoutParentInput = {
    id?: string
    actor: string
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    dataset: DatasetCreateNestedOneWithoutProvenanceInput
    children?: ProvenanceEventCreateNestedManyWithoutParentInput
  }

  export type ProvenanceEventUncheckedCreateWithoutParentInput = {
    id?: string
    datasetId: string
    actor: string
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    children?: ProvenanceEventUncheckedCreateNestedManyWithoutParentInput
  }

  export type ProvenanceEventCreateOrConnectWithoutParentInput = {
    where: ProvenanceEventWhereUniqueInput
    create: XOR<ProvenanceEventCreateWithoutParentInput, ProvenanceEventUncheckedCreateWithoutParentInput>
  }

  export type ProvenanceEventCreateManyParentInputEnvelope = {
    data: ProvenanceEventCreateManyParentInput | ProvenanceEventCreateManyParentInput[]
    skipDuplicates?: boolean
  }

  export type DatasetUpsertWithoutProvenanceInput = {
    update: XOR<DatasetUpdateWithoutProvenanceInput, DatasetUncheckedUpdateWithoutProvenanceInput>
    create: XOR<DatasetCreateWithoutProvenanceInput, DatasetUncheckedCreateWithoutProvenanceInput>
    where?: DatasetWhereInput
  }

  export type DatasetUpdateToOneWithWhereWithoutProvenanceInput = {
    where?: DatasetWhereInput
    data: XOR<DatasetUpdateWithoutProvenanceInput, DatasetUncheckedUpdateWithoutProvenanceInput>
  }

  export type DatasetUpdateWithoutProvenanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    task?: StringFieldUpdateOperationsInput | string
    embodiments?: DatasetUpdateembodimentsInput | string[]
    episodeCount?: IntFieldUpdateOperationsInput | number
    totalDurationHours?: FloatFieldUpdateOperationsInput | number
    sizeGb?: FloatFieldUpdateOperationsInput | number
    qualityScore?: FloatFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    pricingTier?: StringFieldUpdateOperationsInput | string
    pricePerEpisode?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: DatasetUpdatetagsInput | string[]
    downloads?: IntFieldUpdateOperationsInput | number
    rating?: FloatFieldUpdateOperationsInput | number
    accessLevel?: StringFieldUpdateOperationsInput | string
    licenseType?: StringFieldUpdateOperationsInput | string
    storageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviews?: ReviewUpdateManyWithoutDatasetNestedInput
    purchases?: PurchaseUpdateManyWithoutDatasetNestedInput
    cartItems?: CartItemUpdateManyWithoutDatasetNestedInput
  }

  export type DatasetUncheckedUpdateWithoutProvenanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    task?: StringFieldUpdateOperationsInput | string
    embodiments?: DatasetUpdateembodimentsInput | string[]
    episodeCount?: IntFieldUpdateOperationsInput | number
    totalDurationHours?: FloatFieldUpdateOperationsInput | number
    sizeGb?: FloatFieldUpdateOperationsInput | number
    qualityScore?: FloatFieldUpdateOperationsInput | number
    format?: StringFieldUpdateOperationsInput | string
    pricingTier?: StringFieldUpdateOperationsInput | string
    pricePerEpisode?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: DatasetUpdatetagsInput | string[]
    downloads?: IntFieldUpdateOperationsInput | number
    rating?: FloatFieldUpdateOperationsInput | number
    accessLevel?: StringFieldUpdateOperationsInput | string
    licenseType?: StringFieldUpdateOperationsInput | string
    storageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviews?: ReviewUncheckedUpdateManyWithoutDatasetNestedInput
    purchases?: PurchaseUncheckedUpdateManyWithoutDatasetNestedInput
    cartItems?: CartItemUncheckedUpdateManyWithoutDatasetNestedInput
  }

  export type ProvenanceEventUpsertWithoutChildrenInput = {
    update: XOR<ProvenanceEventUpdateWithoutChildrenInput, ProvenanceEventUncheckedUpdateWithoutChildrenInput>
    create: XOR<ProvenanceEventCreateWithoutChildrenInput, ProvenanceEventUncheckedCreateWithoutChildrenInput>
    where?: ProvenanceEventWhereInput
  }

  export type ProvenanceEventUpdateToOneWithWhereWithoutChildrenInput = {
    where?: ProvenanceEventWhereInput
    data: XOR<ProvenanceEventUpdateWithoutChildrenInput, ProvenanceEventUncheckedUpdateWithoutChildrenInput>
  }

  export type ProvenanceEventUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dataset?: DatasetUpdateOneRequiredWithoutProvenanceNestedInput
    parent?: ProvenanceEventUpdateOneWithoutChildrenNestedInput
  }

  export type ProvenanceEventUncheckedUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    datasetId?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProvenanceEventUpsertWithWhereUniqueWithoutParentInput = {
    where: ProvenanceEventWhereUniqueInput
    update: XOR<ProvenanceEventUpdateWithoutParentInput, ProvenanceEventUncheckedUpdateWithoutParentInput>
    create: XOR<ProvenanceEventCreateWithoutParentInput, ProvenanceEventUncheckedCreateWithoutParentInput>
  }

  export type ProvenanceEventUpdateWithWhereUniqueWithoutParentInput = {
    where: ProvenanceEventWhereUniqueInput
    data: XOR<ProvenanceEventUpdateWithoutParentInput, ProvenanceEventUncheckedUpdateWithoutParentInput>
  }

  export type ProvenanceEventUpdateManyWithWhereWithoutParentInput = {
    where: ProvenanceEventScalarWhereInput
    data: XOR<ProvenanceEventUpdateManyMutationInput, ProvenanceEventUncheckedUpdateManyWithoutParentInput>
  }

  export type ReviewCreateManyDatasetInput = {
    id?: string
    userId: string
    userName: string
    rating: number
    comment: string
    createdAt?: Date | string
  }

  export type PurchaseCreateManyDatasetInput = {
    id?: string
    userId: string
    amount: number
    currency?: string
    stripePaymentId?: string | null
    status?: string
    createdAt?: Date | string
  }

  export type CartItemCreateManyDatasetInput = {
    id?: string
    userId: string
    addedAt?: Date | string
  }

  export type ProvenanceEventCreateManyDatasetInput = {
    id?: string
    actor: string
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    parentId?: string | null
    createdAt?: Date | string
  }

  export type ReviewUpdateWithoutDatasetInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    comment?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewUncheckedUpdateWithoutDatasetInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    comment?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewUncheckedUpdateManyWithoutDatasetInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    comment?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseUpdateWithoutDatasetInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseUncheckedUpdateWithoutDatasetInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseUncheckedUpdateManyWithoutDatasetInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemUpdateWithoutDatasetInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemUncheckedUpdateWithoutDatasetInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemUncheckedUpdateManyWithoutDatasetInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProvenanceEventUpdateWithoutDatasetInput = {
    id?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: ProvenanceEventUpdateOneWithoutChildrenNestedInput
    children?: ProvenanceEventUpdateManyWithoutParentNestedInput
  }

  export type ProvenanceEventUncheckedUpdateWithoutDatasetInput = {
    id?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: ProvenanceEventUncheckedUpdateManyWithoutParentNestedInput
  }

  export type ProvenanceEventUncheckedUpdateManyWithoutDatasetInput = {
    id?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProvenanceEventCreateManyParentInput = {
    id?: string
    datasetId: string
    actor: string
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ProvenanceEventUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dataset?: DatasetUpdateOneRequiredWithoutProvenanceNestedInput
    children?: ProvenanceEventUpdateManyWithoutParentNestedInput
  }

  export type ProvenanceEventUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    datasetId?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: ProvenanceEventUncheckedUpdateManyWithoutParentNestedInput
  }

  export type ProvenanceEventUncheckedUpdateManyWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    datasetId?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use DatasetCountOutputTypeDefaultArgs instead
     */
    export type DatasetCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DatasetCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProvenanceEventCountOutputTypeDefaultArgs instead
     */
    export type ProvenanceEventCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProvenanceEventCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DatasetDefaultArgs instead
     */
    export type DatasetArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DatasetDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReviewDefaultArgs instead
     */
    export type ReviewArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReviewDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PurchaseDefaultArgs instead
     */
    export type PurchaseArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PurchaseDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CartItemDefaultArgs instead
     */
    export type CartItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CartItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProvenanceEventDefaultArgs instead
     */
    export type ProvenanceEventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProvenanceEventDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}