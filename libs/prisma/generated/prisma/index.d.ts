
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
 * Model Institution
 * 
 */
export type Institution = $Result.DefaultSelection<Prisma.$InstitutionPayload>
/**
 * Model Structure
 * 
 */
export type Structure = $Result.DefaultSelection<Prisma.$StructurePayload>
/**
 * Model app_user
 * 
 */
export type app_user = $Result.DefaultSelection<Prisma.$app_userPayload>
/**
 * Model UserLink
 * 
 */
export type UserLink = $Result.DefaultSelection<Prisma.$UserLinkPayload>
/**
 * Model UserStructure
 * 
 */
export type UserStructure = $Result.DefaultSelection<Prisma.$UserStructurePayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model Dimension
 * 
 */
export type Dimension = $Result.DefaultSelection<Prisma.$DimensionPayload>
/**
 * Model Archetype
 * 
 */
export type Archetype = $Result.DefaultSelection<Prisma.$ArchetypePayload>
/**
 * Model Content
 * 
 */
export type Content = $Result.DefaultSelection<Prisma.$ContentPayload>
/**
 * Model UserContentProgress
 * 
 */
export type UserContentProgress = $Result.DefaultSelection<Prisma.$UserContentProgressPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const linkType: {
  STUDENT: 'STUDENT',
  ASSISTANT: 'ASSISTANT',
  TEACHER: 'TEACHER',
  DIRECTOR: 'DIRECTOR'
};

export type linkType = (typeof linkType)[keyof typeof linkType]

}

export type linkType = $Enums.linkType

export const linkType: typeof $Enums.linkType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Institutions
 * const institutions = await prisma.institution.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
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
   * // Fetch zero or more Institutions
   * const institutions = await prisma.institution.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

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


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.institution`: Exposes CRUD operations for the **Institution** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Institutions
    * const institutions = await prisma.institution.findMany()
    * ```
    */
  get institution(): Prisma.InstitutionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.structure`: Exposes CRUD operations for the **Structure** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Structures
    * const structures = await prisma.structure.findMany()
    * ```
    */
  get structure(): Prisma.StructureDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.app_user`: Exposes CRUD operations for the **app_user** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more App_users
    * const app_users = await prisma.app_user.findMany()
    * ```
    */
  get app_user(): Prisma.app_userDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userLink`: Exposes CRUD operations for the **UserLink** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserLinks
    * const userLinks = await prisma.userLink.findMany()
    * ```
    */
  get userLink(): Prisma.UserLinkDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userStructure`: Exposes CRUD operations for the **UserStructure** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserStructures
    * const userStructures = await prisma.userStructure.findMany()
    * ```
    */
  get userStructure(): Prisma.UserStructureDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dimension`: Exposes CRUD operations for the **Dimension** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Dimensions
    * const dimensions = await prisma.dimension.findMany()
    * ```
    */
  get dimension(): Prisma.DimensionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.archetype`: Exposes CRUD operations for the **Archetype** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Archetypes
    * const archetypes = await prisma.archetype.findMany()
    * ```
    */
  get archetype(): Prisma.ArchetypeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.content`: Exposes CRUD operations for the **Content** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Contents
    * const contents = await prisma.content.findMany()
    * ```
    */
  get content(): Prisma.ContentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userContentProgress`: Exposes CRUD operations for the **UserContentProgress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserContentProgresses
    * const userContentProgresses = await prisma.userContentProgress.findMany()
    * ```
    */
  get userContentProgress(): Prisma.UserContentProgressDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 6.19.0
   * Query Engine version: 2ba551f319ab1df4bc874a89965d8b3641056773
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
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
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
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
    Institution: 'Institution',
    Structure: 'Structure',
    app_user: 'app_user',
    UserLink: 'UserLink',
    UserStructure: 'UserStructure',
    Session: 'Session',
    Dimension: 'Dimension',
    Archetype: 'Archetype',
    Content: 'Content',
    UserContentProgress: 'UserContentProgress',
    AuditLog: 'AuditLog',
    Notification: 'Notification'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "institution" | "structure" | "app_user" | "userLink" | "userStructure" | "session" | "dimension" | "archetype" | "content" | "userContentProgress" | "auditLog" | "notification"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Institution: {
        payload: Prisma.$InstitutionPayload<ExtArgs>
        fields: Prisma.InstitutionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InstitutionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InstitutionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionPayload>
          }
          findFirst: {
            args: Prisma.InstitutionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InstitutionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionPayload>
          }
          findMany: {
            args: Prisma.InstitutionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionPayload>[]
          }
          create: {
            args: Prisma.InstitutionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionPayload>
          }
          createMany: {
            args: Prisma.InstitutionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InstitutionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionPayload>[]
          }
          delete: {
            args: Prisma.InstitutionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionPayload>
          }
          update: {
            args: Prisma.InstitutionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionPayload>
          }
          deleteMany: {
            args: Prisma.InstitutionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InstitutionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InstitutionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionPayload>[]
          }
          upsert: {
            args: Prisma.InstitutionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionPayload>
          }
          aggregate: {
            args: Prisma.InstitutionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInstitution>
          }
          groupBy: {
            args: Prisma.InstitutionGroupByArgs<ExtArgs>
            result: $Utils.Optional<InstitutionGroupByOutputType>[]
          }
          count: {
            args: Prisma.InstitutionCountArgs<ExtArgs>
            result: $Utils.Optional<InstitutionCountAggregateOutputType> | number
          }
        }
      }
      Structure: {
        payload: Prisma.$StructurePayload<ExtArgs>
        fields: Prisma.StructureFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StructureFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StructurePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StructureFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StructurePayload>
          }
          findFirst: {
            args: Prisma.StructureFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StructurePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StructureFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StructurePayload>
          }
          findMany: {
            args: Prisma.StructureFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StructurePayload>[]
          }
          create: {
            args: Prisma.StructureCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StructurePayload>
          }
          createMany: {
            args: Prisma.StructureCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StructureCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StructurePayload>[]
          }
          delete: {
            args: Prisma.StructureDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StructurePayload>
          }
          update: {
            args: Prisma.StructureUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StructurePayload>
          }
          deleteMany: {
            args: Prisma.StructureDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StructureUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StructureUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StructurePayload>[]
          }
          upsert: {
            args: Prisma.StructureUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StructurePayload>
          }
          aggregate: {
            args: Prisma.StructureAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStructure>
          }
          groupBy: {
            args: Prisma.StructureGroupByArgs<ExtArgs>
            result: $Utils.Optional<StructureGroupByOutputType>[]
          }
          count: {
            args: Prisma.StructureCountArgs<ExtArgs>
            result: $Utils.Optional<StructureCountAggregateOutputType> | number
          }
        }
      }
      app_user: {
        payload: Prisma.$app_userPayload<ExtArgs>
        fields: Prisma.app_userFieldRefs
        operations: {
          findUnique: {
            args: Prisma.app_userFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$app_userPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.app_userFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$app_userPayload>
          }
          findFirst: {
            args: Prisma.app_userFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$app_userPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.app_userFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$app_userPayload>
          }
          findMany: {
            args: Prisma.app_userFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$app_userPayload>[]
          }
          create: {
            args: Prisma.app_userCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$app_userPayload>
          }
          createMany: {
            args: Prisma.app_userCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.app_userCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$app_userPayload>[]
          }
          delete: {
            args: Prisma.app_userDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$app_userPayload>
          }
          update: {
            args: Prisma.app_userUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$app_userPayload>
          }
          deleteMany: {
            args: Prisma.app_userDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.app_userUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.app_userUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$app_userPayload>[]
          }
          upsert: {
            args: Prisma.app_userUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$app_userPayload>
          }
          aggregate: {
            args: Prisma.App_userAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApp_user>
          }
          groupBy: {
            args: Prisma.app_userGroupByArgs<ExtArgs>
            result: $Utils.Optional<App_userGroupByOutputType>[]
          }
          count: {
            args: Prisma.app_userCountArgs<ExtArgs>
            result: $Utils.Optional<App_userCountAggregateOutputType> | number
          }
        }
      }
      UserLink: {
        payload: Prisma.$UserLinkPayload<ExtArgs>
        fields: Prisma.UserLinkFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserLinkFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLinkPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserLinkFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLinkPayload>
          }
          findFirst: {
            args: Prisma.UserLinkFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLinkPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserLinkFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLinkPayload>
          }
          findMany: {
            args: Prisma.UserLinkFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLinkPayload>[]
          }
          create: {
            args: Prisma.UserLinkCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLinkPayload>
          }
          createMany: {
            args: Prisma.UserLinkCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserLinkCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLinkPayload>[]
          }
          delete: {
            args: Prisma.UserLinkDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLinkPayload>
          }
          update: {
            args: Prisma.UserLinkUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLinkPayload>
          }
          deleteMany: {
            args: Prisma.UserLinkDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserLinkUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserLinkUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLinkPayload>[]
          }
          upsert: {
            args: Prisma.UserLinkUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLinkPayload>
          }
          aggregate: {
            args: Prisma.UserLinkAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserLink>
          }
          groupBy: {
            args: Prisma.UserLinkGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserLinkGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserLinkCountArgs<ExtArgs>
            result: $Utils.Optional<UserLinkCountAggregateOutputType> | number
          }
        }
      }
      UserStructure: {
        payload: Prisma.$UserStructurePayload<ExtArgs>
        fields: Prisma.UserStructureFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserStructureFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStructurePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserStructureFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStructurePayload>
          }
          findFirst: {
            args: Prisma.UserStructureFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStructurePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserStructureFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStructurePayload>
          }
          findMany: {
            args: Prisma.UserStructureFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStructurePayload>[]
          }
          create: {
            args: Prisma.UserStructureCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStructurePayload>
          }
          createMany: {
            args: Prisma.UserStructureCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserStructureCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStructurePayload>[]
          }
          delete: {
            args: Prisma.UserStructureDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStructurePayload>
          }
          update: {
            args: Prisma.UserStructureUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStructurePayload>
          }
          deleteMany: {
            args: Prisma.UserStructureDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserStructureUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserStructureUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStructurePayload>[]
          }
          upsert: {
            args: Prisma.UserStructureUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStructurePayload>
          }
          aggregate: {
            args: Prisma.UserStructureAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserStructure>
          }
          groupBy: {
            args: Prisma.UserStructureGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserStructureGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserStructureCountArgs<ExtArgs>
            result: $Utils.Optional<UserStructureCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      Dimension: {
        payload: Prisma.$DimensionPayload<ExtArgs>
        fields: Prisma.DimensionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DimensionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DimensionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionPayload>
          }
          findFirst: {
            args: Prisma.DimensionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DimensionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionPayload>
          }
          findMany: {
            args: Prisma.DimensionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionPayload>[]
          }
          create: {
            args: Prisma.DimensionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionPayload>
          }
          createMany: {
            args: Prisma.DimensionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DimensionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionPayload>[]
          }
          delete: {
            args: Prisma.DimensionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionPayload>
          }
          update: {
            args: Prisma.DimensionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionPayload>
          }
          deleteMany: {
            args: Prisma.DimensionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DimensionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DimensionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionPayload>[]
          }
          upsert: {
            args: Prisma.DimensionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionPayload>
          }
          aggregate: {
            args: Prisma.DimensionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDimension>
          }
          groupBy: {
            args: Prisma.DimensionGroupByArgs<ExtArgs>
            result: $Utils.Optional<DimensionGroupByOutputType>[]
          }
          count: {
            args: Prisma.DimensionCountArgs<ExtArgs>
            result: $Utils.Optional<DimensionCountAggregateOutputType> | number
          }
        }
      }
      Archetype: {
        payload: Prisma.$ArchetypePayload<ExtArgs>
        fields: Prisma.ArchetypeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ArchetypeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArchetypePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ArchetypeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArchetypePayload>
          }
          findFirst: {
            args: Prisma.ArchetypeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArchetypePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ArchetypeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArchetypePayload>
          }
          findMany: {
            args: Prisma.ArchetypeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArchetypePayload>[]
          }
          create: {
            args: Prisma.ArchetypeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArchetypePayload>
          }
          createMany: {
            args: Prisma.ArchetypeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ArchetypeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArchetypePayload>[]
          }
          delete: {
            args: Prisma.ArchetypeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArchetypePayload>
          }
          update: {
            args: Prisma.ArchetypeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArchetypePayload>
          }
          deleteMany: {
            args: Prisma.ArchetypeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ArchetypeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ArchetypeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArchetypePayload>[]
          }
          upsert: {
            args: Prisma.ArchetypeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArchetypePayload>
          }
          aggregate: {
            args: Prisma.ArchetypeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateArchetype>
          }
          groupBy: {
            args: Prisma.ArchetypeGroupByArgs<ExtArgs>
            result: $Utils.Optional<ArchetypeGroupByOutputType>[]
          }
          count: {
            args: Prisma.ArchetypeCountArgs<ExtArgs>
            result: $Utils.Optional<ArchetypeCountAggregateOutputType> | number
          }
        }
      }
      Content: {
        payload: Prisma.$ContentPayload<ExtArgs>
        fields: Prisma.ContentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ContentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ContentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentPayload>
          }
          findFirst: {
            args: Prisma.ContentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ContentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentPayload>
          }
          findMany: {
            args: Prisma.ContentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentPayload>[]
          }
          create: {
            args: Prisma.ContentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentPayload>
          }
          createMany: {
            args: Prisma.ContentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ContentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentPayload>[]
          }
          delete: {
            args: Prisma.ContentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentPayload>
          }
          update: {
            args: Prisma.ContentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentPayload>
          }
          deleteMany: {
            args: Prisma.ContentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ContentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ContentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentPayload>[]
          }
          upsert: {
            args: Prisma.ContentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentPayload>
          }
          aggregate: {
            args: Prisma.ContentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateContent>
          }
          groupBy: {
            args: Prisma.ContentGroupByArgs<ExtArgs>
            result: $Utils.Optional<ContentGroupByOutputType>[]
          }
          count: {
            args: Prisma.ContentCountArgs<ExtArgs>
            result: $Utils.Optional<ContentCountAggregateOutputType> | number
          }
        }
      }
      UserContentProgress: {
        payload: Prisma.$UserContentProgressPayload<ExtArgs>
        fields: Prisma.UserContentProgressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserContentProgressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserContentProgressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserContentProgressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserContentProgressPayload>
          }
          findFirst: {
            args: Prisma.UserContentProgressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserContentProgressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserContentProgressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserContentProgressPayload>
          }
          findMany: {
            args: Prisma.UserContentProgressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserContentProgressPayload>[]
          }
          create: {
            args: Prisma.UserContentProgressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserContentProgressPayload>
          }
          createMany: {
            args: Prisma.UserContentProgressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserContentProgressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserContentProgressPayload>[]
          }
          delete: {
            args: Prisma.UserContentProgressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserContentProgressPayload>
          }
          update: {
            args: Prisma.UserContentProgressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserContentProgressPayload>
          }
          deleteMany: {
            args: Prisma.UserContentProgressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserContentProgressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserContentProgressUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserContentProgressPayload>[]
          }
          upsert: {
            args: Prisma.UserContentProgressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserContentProgressPayload>
          }
          aggregate: {
            args: Prisma.UserContentProgressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserContentProgress>
          }
          groupBy: {
            args: Prisma.UserContentProgressGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserContentProgressGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserContentProgressCountArgs<ExtArgs>
            result: $Utils.Optional<UserContentProgressCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NotificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
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
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
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
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    institution?: InstitutionOmit
    structure?: StructureOmit
    app_user?: app_userOmit
    userLink?: UserLinkOmit
    userStructure?: UserStructureOmit
    session?: SessionOmit
    dimension?: DimensionOmit
    archetype?: ArchetypeOmit
    content?: ContentOmit
    userContentProgress?: UserContentProgressOmit
    auditLog?: AuditLogOmit
    notification?: NotificationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

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
    | 'updateManyAndReturn'
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
   * Count Type InstitutionCountOutputType
   */

  export type InstitutionCountOutputType = {
    structures: number
  }

  export type InstitutionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    structures?: boolean | InstitutionCountOutputTypeCountStructuresArgs
  }

  // Custom InputTypes
  /**
   * InstitutionCountOutputType without action
   */
  export type InstitutionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionCountOutputType
     */
    select?: InstitutionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * InstitutionCountOutputType without action
   */
  export type InstitutionCountOutputTypeCountStructuresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StructureWhereInput
  }


  /**
   * Count Type StructureCountOutputType
   */

  export type StructureCountOutputType = {
    userStructures: number
    children: number
  }

  export type StructureCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userStructures?: boolean | StructureCountOutputTypeCountUserStructuresArgs
    children?: boolean | StructureCountOutputTypeCountChildrenArgs
  }

  // Custom InputTypes
  /**
   * StructureCountOutputType without action
   */
  export type StructureCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StructureCountOutputType
     */
    select?: StructureCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StructureCountOutputType without action
   */
  export type StructureCountOutputTypeCountUserStructuresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserStructureWhereInput
  }

  /**
   * StructureCountOutputType without action
   */
  export type StructureCountOutputTypeCountChildrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StructureWhereInput
  }


  /**
   * Count Type App_userCountOutputType
   */

  export type App_userCountOutputType = {
    auditLogs: number
    sessions: number
    linksFrom: number
    linksTo: number
    userStructures: number
    notifications: number
    contentProgress: number
  }

  export type App_userCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditLogs?: boolean | App_userCountOutputTypeCountAuditLogsArgs
    sessions?: boolean | App_userCountOutputTypeCountSessionsArgs
    linksFrom?: boolean | App_userCountOutputTypeCountLinksFromArgs
    linksTo?: boolean | App_userCountOutputTypeCountLinksToArgs
    userStructures?: boolean | App_userCountOutputTypeCountUserStructuresArgs
    notifications?: boolean | App_userCountOutputTypeCountNotificationsArgs
    contentProgress?: boolean | App_userCountOutputTypeCountContentProgressArgs
  }

  // Custom InputTypes
  /**
   * App_userCountOutputType without action
   */
  export type App_userCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the App_userCountOutputType
     */
    select?: App_userCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * App_userCountOutputType without action
   */
  export type App_userCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }

  /**
   * App_userCountOutputType without action
   */
  export type App_userCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * App_userCountOutputType without action
   */
  export type App_userCountOutputTypeCountLinksFromArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserLinkWhereInput
  }

  /**
   * App_userCountOutputType without action
   */
  export type App_userCountOutputTypeCountLinksToArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserLinkWhereInput
  }

  /**
   * App_userCountOutputType without action
   */
  export type App_userCountOutputTypeCountUserStructuresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserStructureWhereInput
  }

  /**
   * App_userCountOutputType without action
   */
  export type App_userCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }

  /**
   * App_userCountOutputType without action
   */
  export type App_userCountOutputTypeCountContentProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserContentProgressWhereInput
  }


  /**
   * Count Type DimensionCountOutputType
   */

  export type DimensionCountOutputType = {
    archetypes: number
  }

  export type DimensionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    archetypes?: boolean | DimensionCountOutputTypeCountArchetypesArgs
  }

  // Custom InputTypes
  /**
   * DimensionCountOutputType without action
   */
  export type DimensionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DimensionCountOutputType
     */
    select?: DimensionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DimensionCountOutputType without action
   */
  export type DimensionCountOutputTypeCountArchetypesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArchetypeWhereInput
  }


  /**
   * Count Type ContentCountOutputType
   */

  export type ContentCountOutputType = {
    prerequisites: number
    userProgress: number
  }

  export type ContentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    prerequisites?: boolean | ContentCountOutputTypeCountPrerequisitesArgs
    userProgress?: boolean | ContentCountOutputTypeCountUserProgressArgs
  }

  // Custom InputTypes
  /**
   * ContentCountOutputType without action
   */
  export type ContentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentCountOutputType
     */
    select?: ContentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ContentCountOutputType without action
   */
  export type ContentCountOutputTypeCountPrerequisitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContentWhereInput
  }

  /**
   * ContentCountOutputType without action
   */
  export type ContentCountOutputTypeCountUserProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserContentProgressWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Institution
   */

  export type AggregateInstitution = {
    _count: InstitutionCountAggregateOutputType | null
    _min: InstitutionMinAggregateOutputType | null
    _max: InstitutionMaxAggregateOutputType | null
  }

  export type InstitutionMinAggregateOutputType = {
    institution_id: string | null
    name: string | null
    description: string | null
    created_at: Date | null
  }

  export type InstitutionMaxAggregateOutputType = {
    institution_id: string | null
    name: string | null
    description: string | null
    created_at: Date | null
  }

  export type InstitutionCountAggregateOutputType = {
    institution_id: number
    name: number
    description: number
    created_at: number
    _all: number
  }


  export type InstitutionMinAggregateInputType = {
    institution_id?: true
    name?: true
    description?: true
    created_at?: true
  }

  export type InstitutionMaxAggregateInputType = {
    institution_id?: true
    name?: true
    description?: true
    created_at?: true
  }

  export type InstitutionCountAggregateInputType = {
    institution_id?: true
    name?: true
    description?: true
    created_at?: true
    _all?: true
  }

  export type InstitutionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Institution to aggregate.
     */
    where?: InstitutionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Institutions to fetch.
     */
    orderBy?: InstitutionOrderByWithRelationInput | InstitutionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InstitutionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Institutions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Institutions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Institutions
    **/
    _count?: true | InstitutionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InstitutionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InstitutionMaxAggregateInputType
  }

  export type GetInstitutionAggregateType<T extends InstitutionAggregateArgs> = {
        [P in keyof T & keyof AggregateInstitution]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInstitution[P]>
      : GetScalarType<T[P], AggregateInstitution[P]>
  }




  export type InstitutionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InstitutionWhereInput
    orderBy?: InstitutionOrderByWithAggregationInput | InstitutionOrderByWithAggregationInput[]
    by: InstitutionScalarFieldEnum[] | InstitutionScalarFieldEnum
    having?: InstitutionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InstitutionCountAggregateInputType | true
    _min?: InstitutionMinAggregateInputType
    _max?: InstitutionMaxAggregateInputType
  }

  export type InstitutionGroupByOutputType = {
    institution_id: string
    name: string | null
    description: string | null
    created_at: Date
    _count: InstitutionCountAggregateOutputType | null
    _min: InstitutionMinAggregateOutputType | null
    _max: InstitutionMaxAggregateOutputType | null
  }

  type GetInstitutionGroupByPayload<T extends InstitutionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InstitutionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InstitutionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InstitutionGroupByOutputType[P]>
            : GetScalarType<T[P], InstitutionGroupByOutputType[P]>
        }
      >
    >


  export type InstitutionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    institution_id?: boolean
    name?: boolean
    description?: boolean
    created_at?: boolean
    structures?: boolean | Institution$structuresArgs<ExtArgs>
    _count?: boolean | InstitutionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["institution"]>

  export type InstitutionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    institution_id?: boolean
    name?: boolean
    description?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["institution"]>

  export type InstitutionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    institution_id?: boolean
    name?: boolean
    description?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["institution"]>

  export type InstitutionSelectScalar = {
    institution_id?: boolean
    name?: boolean
    description?: boolean
    created_at?: boolean
  }

  export type InstitutionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"institution_id" | "name" | "description" | "created_at", ExtArgs["result"]["institution"]>
  export type InstitutionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    structures?: boolean | Institution$structuresArgs<ExtArgs>
    _count?: boolean | InstitutionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type InstitutionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type InstitutionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $InstitutionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Institution"
    objects: {
      structures: Prisma.$StructurePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      institution_id: string
      name: string | null
      description: string | null
      created_at: Date
    }, ExtArgs["result"]["institution"]>
    composites: {}
  }

  type InstitutionGetPayload<S extends boolean | null | undefined | InstitutionDefaultArgs> = $Result.GetResult<Prisma.$InstitutionPayload, S>

  type InstitutionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InstitutionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InstitutionCountAggregateInputType | true
    }

  export interface InstitutionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Institution'], meta: { name: 'Institution' } }
    /**
     * Find zero or one Institution that matches the filter.
     * @param {InstitutionFindUniqueArgs} args - Arguments to find a Institution
     * @example
     * // Get one Institution
     * const institution = await prisma.institution.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InstitutionFindUniqueArgs>(args: SelectSubset<T, InstitutionFindUniqueArgs<ExtArgs>>): Prisma__InstitutionClient<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Institution that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InstitutionFindUniqueOrThrowArgs} args - Arguments to find a Institution
     * @example
     * // Get one Institution
     * const institution = await prisma.institution.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InstitutionFindUniqueOrThrowArgs>(args: SelectSubset<T, InstitutionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InstitutionClient<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Institution that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionFindFirstArgs} args - Arguments to find a Institution
     * @example
     * // Get one Institution
     * const institution = await prisma.institution.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InstitutionFindFirstArgs>(args?: SelectSubset<T, InstitutionFindFirstArgs<ExtArgs>>): Prisma__InstitutionClient<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Institution that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionFindFirstOrThrowArgs} args - Arguments to find a Institution
     * @example
     * // Get one Institution
     * const institution = await prisma.institution.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InstitutionFindFirstOrThrowArgs>(args?: SelectSubset<T, InstitutionFindFirstOrThrowArgs<ExtArgs>>): Prisma__InstitutionClient<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Institutions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Institutions
     * const institutions = await prisma.institution.findMany()
     * 
     * // Get first 10 Institutions
     * const institutions = await prisma.institution.findMany({ take: 10 })
     * 
     * // Only select the `institution_id`
     * const institutionWithInstitution_idOnly = await prisma.institution.findMany({ select: { institution_id: true } })
     * 
     */
    findMany<T extends InstitutionFindManyArgs>(args?: SelectSubset<T, InstitutionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Institution.
     * @param {InstitutionCreateArgs} args - Arguments to create a Institution.
     * @example
     * // Create one Institution
     * const Institution = await prisma.institution.create({
     *   data: {
     *     // ... data to create a Institution
     *   }
     * })
     * 
     */
    create<T extends InstitutionCreateArgs>(args: SelectSubset<T, InstitutionCreateArgs<ExtArgs>>): Prisma__InstitutionClient<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Institutions.
     * @param {InstitutionCreateManyArgs} args - Arguments to create many Institutions.
     * @example
     * // Create many Institutions
     * const institution = await prisma.institution.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InstitutionCreateManyArgs>(args?: SelectSubset<T, InstitutionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Institutions and returns the data saved in the database.
     * @param {InstitutionCreateManyAndReturnArgs} args - Arguments to create many Institutions.
     * @example
     * // Create many Institutions
     * const institution = await prisma.institution.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Institutions and only return the `institution_id`
     * const institutionWithInstitution_idOnly = await prisma.institution.createManyAndReturn({
     *   select: { institution_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InstitutionCreateManyAndReturnArgs>(args?: SelectSubset<T, InstitutionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Institution.
     * @param {InstitutionDeleteArgs} args - Arguments to delete one Institution.
     * @example
     * // Delete one Institution
     * const Institution = await prisma.institution.delete({
     *   where: {
     *     // ... filter to delete one Institution
     *   }
     * })
     * 
     */
    delete<T extends InstitutionDeleteArgs>(args: SelectSubset<T, InstitutionDeleteArgs<ExtArgs>>): Prisma__InstitutionClient<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Institution.
     * @param {InstitutionUpdateArgs} args - Arguments to update one Institution.
     * @example
     * // Update one Institution
     * const institution = await prisma.institution.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InstitutionUpdateArgs>(args: SelectSubset<T, InstitutionUpdateArgs<ExtArgs>>): Prisma__InstitutionClient<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Institutions.
     * @param {InstitutionDeleteManyArgs} args - Arguments to filter Institutions to delete.
     * @example
     * // Delete a few Institutions
     * const { count } = await prisma.institution.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InstitutionDeleteManyArgs>(args?: SelectSubset<T, InstitutionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Institutions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Institutions
     * const institution = await prisma.institution.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InstitutionUpdateManyArgs>(args: SelectSubset<T, InstitutionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Institutions and returns the data updated in the database.
     * @param {InstitutionUpdateManyAndReturnArgs} args - Arguments to update many Institutions.
     * @example
     * // Update many Institutions
     * const institution = await prisma.institution.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Institutions and only return the `institution_id`
     * const institutionWithInstitution_idOnly = await prisma.institution.updateManyAndReturn({
     *   select: { institution_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends InstitutionUpdateManyAndReturnArgs>(args: SelectSubset<T, InstitutionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Institution.
     * @param {InstitutionUpsertArgs} args - Arguments to update or create a Institution.
     * @example
     * // Update or create a Institution
     * const institution = await prisma.institution.upsert({
     *   create: {
     *     // ... data to create a Institution
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Institution we want to update
     *   }
     * })
     */
    upsert<T extends InstitutionUpsertArgs>(args: SelectSubset<T, InstitutionUpsertArgs<ExtArgs>>): Prisma__InstitutionClient<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Institutions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionCountArgs} args - Arguments to filter Institutions to count.
     * @example
     * // Count the number of Institutions
     * const count = await prisma.institution.count({
     *   where: {
     *     // ... the filter for the Institutions we want to count
     *   }
     * })
    **/
    count<T extends InstitutionCountArgs>(
      args?: Subset<T, InstitutionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InstitutionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Institution.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InstitutionAggregateArgs>(args: Subset<T, InstitutionAggregateArgs>): Prisma.PrismaPromise<GetInstitutionAggregateType<T>>

    /**
     * Group by Institution.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionGroupByArgs} args - Group by arguments.
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
      T extends InstitutionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InstitutionGroupByArgs['orderBy'] }
        : { orderBy?: InstitutionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InstitutionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInstitutionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Institution model
   */
  readonly fields: InstitutionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Institution.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InstitutionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    structures<T extends Institution$structuresArgs<ExtArgs> = {}>(args?: Subset<T, Institution$structuresArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StructurePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Institution model
   */
  interface InstitutionFieldRefs {
    readonly institution_id: FieldRef<"Institution", 'String'>
    readonly name: FieldRef<"Institution", 'String'>
    readonly description: FieldRef<"Institution", 'String'>
    readonly created_at: FieldRef<"Institution", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Institution findUnique
   */
  export type InstitutionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institution
     */
    select?: InstitutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Institution
     */
    omit?: InstitutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInclude<ExtArgs> | null
    /**
     * Filter, which Institution to fetch.
     */
    where: InstitutionWhereUniqueInput
  }

  /**
   * Institution findUniqueOrThrow
   */
  export type InstitutionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institution
     */
    select?: InstitutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Institution
     */
    omit?: InstitutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInclude<ExtArgs> | null
    /**
     * Filter, which Institution to fetch.
     */
    where: InstitutionWhereUniqueInput
  }

  /**
   * Institution findFirst
   */
  export type InstitutionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institution
     */
    select?: InstitutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Institution
     */
    omit?: InstitutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInclude<ExtArgs> | null
    /**
     * Filter, which Institution to fetch.
     */
    where?: InstitutionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Institutions to fetch.
     */
    orderBy?: InstitutionOrderByWithRelationInput | InstitutionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Institutions.
     */
    cursor?: InstitutionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Institutions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Institutions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Institutions.
     */
    distinct?: InstitutionScalarFieldEnum | InstitutionScalarFieldEnum[]
  }

  /**
   * Institution findFirstOrThrow
   */
  export type InstitutionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institution
     */
    select?: InstitutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Institution
     */
    omit?: InstitutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInclude<ExtArgs> | null
    /**
     * Filter, which Institution to fetch.
     */
    where?: InstitutionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Institutions to fetch.
     */
    orderBy?: InstitutionOrderByWithRelationInput | InstitutionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Institutions.
     */
    cursor?: InstitutionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Institutions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Institutions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Institutions.
     */
    distinct?: InstitutionScalarFieldEnum | InstitutionScalarFieldEnum[]
  }

  /**
   * Institution findMany
   */
  export type InstitutionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institution
     */
    select?: InstitutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Institution
     */
    omit?: InstitutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInclude<ExtArgs> | null
    /**
     * Filter, which Institutions to fetch.
     */
    where?: InstitutionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Institutions to fetch.
     */
    orderBy?: InstitutionOrderByWithRelationInput | InstitutionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Institutions.
     */
    cursor?: InstitutionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Institutions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Institutions.
     */
    skip?: number
    distinct?: InstitutionScalarFieldEnum | InstitutionScalarFieldEnum[]
  }

  /**
   * Institution create
   */
  export type InstitutionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institution
     */
    select?: InstitutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Institution
     */
    omit?: InstitutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInclude<ExtArgs> | null
    /**
     * The data needed to create a Institution.
     */
    data?: XOR<InstitutionCreateInput, InstitutionUncheckedCreateInput>
  }

  /**
   * Institution createMany
   */
  export type InstitutionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Institutions.
     */
    data: InstitutionCreateManyInput | InstitutionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Institution createManyAndReturn
   */
  export type InstitutionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institution
     */
    select?: InstitutionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Institution
     */
    omit?: InstitutionOmit<ExtArgs> | null
    /**
     * The data used to create many Institutions.
     */
    data: InstitutionCreateManyInput | InstitutionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Institution update
   */
  export type InstitutionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institution
     */
    select?: InstitutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Institution
     */
    omit?: InstitutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInclude<ExtArgs> | null
    /**
     * The data needed to update a Institution.
     */
    data: XOR<InstitutionUpdateInput, InstitutionUncheckedUpdateInput>
    /**
     * Choose, which Institution to update.
     */
    where: InstitutionWhereUniqueInput
  }

  /**
   * Institution updateMany
   */
  export type InstitutionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Institutions.
     */
    data: XOR<InstitutionUpdateManyMutationInput, InstitutionUncheckedUpdateManyInput>
    /**
     * Filter which Institutions to update
     */
    where?: InstitutionWhereInput
    /**
     * Limit how many Institutions to update.
     */
    limit?: number
  }

  /**
   * Institution updateManyAndReturn
   */
  export type InstitutionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institution
     */
    select?: InstitutionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Institution
     */
    omit?: InstitutionOmit<ExtArgs> | null
    /**
     * The data used to update Institutions.
     */
    data: XOR<InstitutionUpdateManyMutationInput, InstitutionUncheckedUpdateManyInput>
    /**
     * Filter which Institutions to update
     */
    where?: InstitutionWhereInput
    /**
     * Limit how many Institutions to update.
     */
    limit?: number
  }

  /**
   * Institution upsert
   */
  export type InstitutionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institution
     */
    select?: InstitutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Institution
     */
    omit?: InstitutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInclude<ExtArgs> | null
    /**
     * The filter to search for the Institution to update in case it exists.
     */
    where: InstitutionWhereUniqueInput
    /**
     * In case the Institution found by the `where` argument doesn't exist, create a new Institution with this data.
     */
    create: XOR<InstitutionCreateInput, InstitutionUncheckedCreateInput>
    /**
     * In case the Institution was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InstitutionUpdateInput, InstitutionUncheckedUpdateInput>
  }

  /**
   * Institution delete
   */
  export type InstitutionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institution
     */
    select?: InstitutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Institution
     */
    omit?: InstitutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInclude<ExtArgs> | null
    /**
     * Filter which Institution to delete.
     */
    where: InstitutionWhereUniqueInput
  }

  /**
   * Institution deleteMany
   */
  export type InstitutionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Institutions to delete
     */
    where?: InstitutionWhereInput
    /**
     * Limit how many Institutions to delete.
     */
    limit?: number
  }

  /**
   * Institution.structures
   */
  export type Institution$structuresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Structure
     */
    select?: StructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Structure
     */
    omit?: StructureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StructureInclude<ExtArgs> | null
    where?: StructureWhereInput
    orderBy?: StructureOrderByWithRelationInput | StructureOrderByWithRelationInput[]
    cursor?: StructureWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StructureScalarFieldEnum | StructureScalarFieldEnum[]
  }

  /**
   * Institution without action
   */
  export type InstitutionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institution
     */
    select?: InstitutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Institution
     */
    omit?: InstitutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInclude<ExtArgs> | null
  }


  /**
   * Model Structure
   */

  export type AggregateStructure = {
    _count: StructureCountAggregateOutputType | null
    _min: StructureMinAggregateOutputType | null
    _max: StructureMaxAggregateOutputType | null
  }

  export type StructureMinAggregateOutputType = {
    structure_id: string | null
    institution_id: string | null
    name: string | null
    parent_id: string | null
    description: string | null
    created_at: Date | null
  }

  export type StructureMaxAggregateOutputType = {
    structure_id: string | null
    institution_id: string | null
    name: string | null
    parent_id: string | null
    description: string | null
    created_at: Date | null
  }

  export type StructureCountAggregateOutputType = {
    structure_id: number
    institution_id: number
    name: number
    parent_id: number
    description: number
    created_at: number
    _all: number
  }


  export type StructureMinAggregateInputType = {
    structure_id?: true
    institution_id?: true
    name?: true
    parent_id?: true
    description?: true
    created_at?: true
  }

  export type StructureMaxAggregateInputType = {
    structure_id?: true
    institution_id?: true
    name?: true
    parent_id?: true
    description?: true
    created_at?: true
  }

  export type StructureCountAggregateInputType = {
    structure_id?: true
    institution_id?: true
    name?: true
    parent_id?: true
    description?: true
    created_at?: true
    _all?: true
  }

  export type StructureAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Structure to aggregate.
     */
    where?: StructureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Structures to fetch.
     */
    orderBy?: StructureOrderByWithRelationInput | StructureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StructureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Structures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Structures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Structures
    **/
    _count?: true | StructureCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StructureMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StructureMaxAggregateInputType
  }

  export type GetStructureAggregateType<T extends StructureAggregateArgs> = {
        [P in keyof T & keyof AggregateStructure]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStructure[P]>
      : GetScalarType<T[P], AggregateStructure[P]>
  }




  export type StructureGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StructureWhereInput
    orderBy?: StructureOrderByWithAggregationInput | StructureOrderByWithAggregationInput[]
    by: StructureScalarFieldEnum[] | StructureScalarFieldEnum
    having?: StructureScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StructureCountAggregateInputType | true
    _min?: StructureMinAggregateInputType
    _max?: StructureMaxAggregateInputType
  }

  export type StructureGroupByOutputType = {
    structure_id: string
    institution_id: string
    name: string
    parent_id: string | null
    description: string | null
    created_at: Date
    _count: StructureCountAggregateOutputType | null
    _min: StructureMinAggregateOutputType | null
    _max: StructureMaxAggregateOutputType | null
  }

  type GetStructureGroupByPayload<T extends StructureGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StructureGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StructureGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StructureGroupByOutputType[P]>
            : GetScalarType<T[P], StructureGroupByOutputType[P]>
        }
      >
    >


  export type StructureSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    structure_id?: boolean
    institution_id?: boolean
    name?: boolean
    parent_id?: boolean
    description?: boolean
    created_at?: boolean
    userStructures?: boolean | Structure$userStructuresArgs<ExtArgs>
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
    parent?: boolean | Structure$parentArgs<ExtArgs>
    children?: boolean | Structure$childrenArgs<ExtArgs>
    _count?: boolean | StructureCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["structure"]>

  export type StructureSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    structure_id?: boolean
    institution_id?: boolean
    name?: boolean
    parent_id?: boolean
    description?: boolean
    created_at?: boolean
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
    parent?: boolean | Structure$parentArgs<ExtArgs>
  }, ExtArgs["result"]["structure"]>

  export type StructureSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    structure_id?: boolean
    institution_id?: boolean
    name?: boolean
    parent_id?: boolean
    description?: boolean
    created_at?: boolean
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
    parent?: boolean | Structure$parentArgs<ExtArgs>
  }, ExtArgs["result"]["structure"]>

  export type StructureSelectScalar = {
    structure_id?: boolean
    institution_id?: boolean
    name?: boolean
    parent_id?: boolean
    description?: boolean
    created_at?: boolean
  }

  export type StructureOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"structure_id" | "institution_id" | "name" | "parent_id" | "description" | "created_at", ExtArgs["result"]["structure"]>
  export type StructureInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userStructures?: boolean | Structure$userStructuresArgs<ExtArgs>
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
    parent?: boolean | Structure$parentArgs<ExtArgs>
    children?: boolean | Structure$childrenArgs<ExtArgs>
    _count?: boolean | StructureCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type StructureIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
    parent?: boolean | Structure$parentArgs<ExtArgs>
  }
  export type StructureIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
    parent?: boolean | Structure$parentArgs<ExtArgs>
  }

  export type $StructurePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Structure"
    objects: {
      userStructures: Prisma.$UserStructurePayload<ExtArgs>[]
      institution: Prisma.$InstitutionPayload<ExtArgs>
      parent: Prisma.$StructurePayload<ExtArgs> | null
      children: Prisma.$StructurePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      structure_id: string
      institution_id: string
      name: string
      parent_id: string | null
      description: string | null
      created_at: Date
    }, ExtArgs["result"]["structure"]>
    composites: {}
  }

  type StructureGetPayload<S extends boolean | null | undefined | StructureDefaultArgs> = $Result.GetResult<Prisma.$StructurePayload, S>

  type StructureCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StructureFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StructureCountAggregateInputType | true
    }

  export interface StructureDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Structure'], meta: { name: 'Structure' } }
    /**
     * Find zero or one Structure that matches the filter.
     * @param {StructureFindUniqueArgs} args - Arguments to find a Structure
     * @example
     * // Get one Structure
     * const structure = await prisma.structure.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StructureFindUniqueArgs>(args: SelectSubset<T, StructureFindUniqueArgs<ExtArgs>>): Prisma__StructureClient<$Result.GetResult<Prisma.$StructurePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Structure that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StructureFindUniqueOrThrowArgs} args - Arguments to find a Structure
     * @example
     * // Get one Structure
     * const structure = await prisma.structure.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StructureFindUniqueOrThrowArgs>(args: SelectSubset<T, StructureFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StructureClient<$Result.GetResult<Prisma.$StructurePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Structure that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StructureFindFirstArgs} args - Arguments to find a Structure
     * @example
     * // Get one Structure
     * const structure = await prisma.structure.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StructureFindFirstArgs>(args?: SelectSubset<T, StructureFindFirstArgs<ExtArgs>>): Prisma__StructureClient<$Result.GetResult<Prisma.$StructurePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Structure that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StructureFindFirstOrThrowArgs} args - Arguments to find a Structure
     * @example
     * // Get one Structure
     * const structure = await prisma.structure.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StructureFindFirstOrThrowArgs>(args?: SelectSubset<T, StructureFindFirstOrThrowArgs<ExtArgs>>): Prisma__StructureClient<$Result.GetResult<Prisma.$StructurePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Structures that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StructureFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Structures
     * const structures = await prisma.structure.findMany()
     * 
     * // Get first 10 Structures
     * const structures = await prisma.structure.findMany({ take: 10 })
     * 
     * // Only select the `structure_id`
     * const structureWithStructure_idOnly = await prisma.structure.findMany({ select: { structure_id: true } })
     * 
     */
    findMany<T extends StructureFindManyArgs>(args?: SelectSubset<T, StructureFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StructurePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Structure.
     * @param {StructureCreateArgs} args - Arguments to create a Structure.
     * @example
     * // Create one Structure
     * const Structure = await prisma.structure.create({
     *   data: {
     *     // ... data to create a Structure
     *   }
     * })
     * 
     */
    create<T extends StructureCreateArgs>(args: SelectSubset<T, StructureCreateArgs<ExtArgs>>): Prisma__StructureClient<$Result.GetResult<Prisma.$StructurePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Structures.
     * @param {StructureCreateManyArgs} args - Arguments to create many Structures.
     * @example
     * // Create many Structures
     * const structure = await prisma.structure.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StructureCreateManyArgs>(args?: SelectSubset<T, StructureCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Structures and returns the data saved in the database.
     * @param {StructureCreateManyAndReturnArgs} args - Arguments to create many Structures.
     * @example
     * // Create many Structures
     * const structure = await prisma.structure.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Structures and only return the `structure_id`
     * const structureWithStructure_idOnly = await prisma.structure.createManyAndReturn({
     *   select: { structure_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StructureCreateManyAndReturnArgs>(args?: SelectSubset<T, StructureCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StructurePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Structure.
     * @param {StructureDeleteArgs} args - Arguments to delete one Structure.
     * @example
     * // Delete one Structure
     * const Structure = await prisma.structure.delete({
     *   where: {
     *     // ... filter to delete one Structure
     *   }
     * })
     * 
     */
    delete<T extends StructureDeleteArgs>(args: SelectSubset<T, StructureDeleteArgs<ExtArgs>>): Prisma__StructureClient<$Result.GetResult<Prisma.$StructurePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Structure.
     * @param {StructureUpdateArgs} args - Arguments to update one Structure.
     * @example
     * // Update one Structure
     * const structure = await prisma.structure.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StructureUpdateArgs>(args: SelectSubset<T, StructureUpdateArgs<ExtArgs>>): Prisma__StructureClient<$Result.GetResult<Prisma.$StructurePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Structures.
     * @param {StructureDeleteManyArgs} args - Arguments to filter Structures to delete.
     * @example
     * // Delete a few Structures
     * const { count } = await prisma.structure.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StructureDeleteManyArgs>(args?: SelectSubset<T, StructureDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Structures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StructureUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Structures
     * const structure = await prisma.structure.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StructureUpdateManyArgs>(args: SelectSubset<T, StructureUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Structures and returns the data updated in the database.
     * @param {StructureUpdateManyAndReturnArgs} args - Arguments to update many Structures.
     * @example
     * // Update many Structures
     * const structure = await prisma.structure.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Structures and only return the `structure_id`
     * const structureWithStructure_idOnly = await prisma.structure.updateManyAndReturn({
     *   select: { structure_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StructureUpdateManyAndReturnArgs>(args: SelectSubset<T, StructureUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StructurePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Structure.
     * @param {StructureUpsertArgs} args - Arguments to update or create a Structure.
     * @example
     * // Update or create a Structure
     * const structure = await prisma.structure.upsert({
     *   create: {
     *     // ... data to create a Structure
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Structure we want to update
     *   }
     * })
     */
    upsert<T extends StructureUpsertArgs>(args: SelectSubset<T, StructureUpsertArgs<ExtArgs>>): Prisma__StructureClient<$Result.GetResult<Prisma.$StructurePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Structures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StructureCountArgs} args - Arguments to filter Structures to count.
     * @example
     * // Count the number of Structures
     * const count = await prisma.structure.count({
     *   where: {
     *     // ... the filter for the Structures we want to count
     *   }
     * })
    **/
    count<T extends StructureCountArgs>(
      args?: Subset<T, StructureCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StructureCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Structure.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StructureAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends StructureAggregateArgs>(args: Subset<T, StructureAggregateArgs>): Prisma.PrismaPromise<GetStructureAggregateType<T>>

    /**
     * Group by Structure.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StructureGroupByArgs} args - Group by arguments.
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
      T extends StructureGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StructureGroupByArgs['orderBy'] }
        : { orderBy?: StructureGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, StructureGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStructureGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Structure model
   */
  readonly fields: StructureFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Structure.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StructureClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    userStructures<T extends Structure$userStructuresArgs<ExtArgs> = {}>(args?: Subset<T, Structure$userStructuresArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserStructurePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    institution<T extends InstitutionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InstitutionDefaultArgs<ExtArgs>>): Prisma__InstitutionClient<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    parent<T extends Structure$parentArgs<ExtArgs> = {}>(args?: Subset<T, Structure$parentArgs<ExtArgs>>): Prisma__StructureClient<$Result.GetResult<Prisma.$StructurePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    children<T extends Structure$childrenArgs<ExtArgs> = {}>(args?: Subset<T, Structure$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StructurePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Structure model
   */
  interface StructureFieldRefs {
    readonly structure_id: FieldRef<"Structure", 'String'>
    readonly institution_id: FieldRef<"Structure", 'String'>
    readonly name: FieldRef<"Structure", 'String'>
    readonly parent_id: FieldRef<"Structure", 'String'>
    readonly description: FieldRef<"Structure", 'String'>
    readonly created_at: FieldRef<"Structure", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Structure findUnique
   */
  export type StructureFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Structure
     */
    select?: StructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Structure
     */
    omit?: StructureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StructureInclude<ExtArgs> | null
    /**
     * Filter, which Structure to fetch.
     */
    where: StructureWhereUniqueInput
  }

  /**
   * Structure findUniqueOrThrow
   */
  export type StructureFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Structure
     */
    select?: StructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Structure
     */
    omit?: StructureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StructureInclude<ExtArgs> | null
    /**
     * Filter, which Structure to fetch.
     */
    where: StructureWhereUniqueInput
  }

  /**
   * Structure findFirst
   */
  export type StructureFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Structure
     */
    select?: StructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Structure
     */
    omit?: StructureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StructureInclude<ExtArgs> | null
    /**
     * Filter, which Structure to fetch.
     */
    where?: StructureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Structures to fetch.
     */
    orderBy?: StructureOrderByWithRelationInput | StructureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Structures.
     */
    cursor?: StructureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Structures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Structures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Structures.
     */
    distinct?: StructureScalarFieldEnum | StructureScalarFieldEnum[]
  }

  /**
   * Structure findFirstOrThrow
   */
  export type StructureFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Structure
     */
    select?: StructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Structure
     */
    omit?: StructureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StructureInclude<ExtArgs> | null
    /**
     * Filter, which Structure to fetch.
     */
    where?: StructureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Structures to fetch.
     */
    orderBy?: StructureOrderByWithRelationInput | StructureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Structures.
     */
    cursor?: StructureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Structures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Structures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Structures.
     */
    distinct?: StructureScalarFieldEnum | StructureScalarFieldEnum[]
  }

  /**
   * Structure findMany
   */
  export type StructureFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Structure
     */
    select?: StructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Structure
     */
    omit?: StructureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StructureInclude<ExtArgs> | null
    /**
     * Filter, which Structures to fetch.
     */
    where?: StructureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Structures to fetch.
     */
    orderBy?: StructureOrderByWithRelationInput | StructureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Structures.
     */
    cursor?: StructureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Structures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Structures.
     */
    skip?: number
    distinct?: StructureScalarFieldEnum | StructureScalarFieldEnum[]
  }

  /**
   * Structure create
   */
  export type StructureCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Structure
     */
    select?: StructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Structure
     */
    omit?: StructureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StructureInclude<ExtArgs> | null
    /**
     * The data needed to create a Structure.
     */
    data: XOR<StructureCreateInput, StructureUncheckedCreateInput>
  }

  /**
   * Structure createMany
   */
  export type StructureCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Structures.
     */
    data: StructureCreateManyInput | StructureCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Structure createManyAndReturn
   */
  export type StructureCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Structure
     */
    select?: StructureSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Structure
     */
    omit?: StructureOmit<ExtArgs> | null
    /**
     * The data used to create many Structures.
     */
    data: StructureCreateManyInput | StructureCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StructureIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Structure update
   */
  export type StructureUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Structure
     */
    select?: StructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Structure
     */
    omit?: StructureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StructureInclude<ExtArgs> | null
    /**
     * The data needed to update a Structure.
     */
    data: XOR<StructureUpdateInput, StructureUncheckedUpdateInput>
    /**
     * Choose, which Structure to update.
     */
    where: StructureWhereUniqueInput
  }

  /**
   * Structure updateMany
   */
  export type StructureUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Structures.
     */
    data: XOR<StructureUpdateManyMutationInput, StructureUncheckedUpdateManyInput>
    /**
     * Filter which Structures to update
     */
    where?: StructureWhereInput
    /**
     * Limit how many Structures to update.
     */
    limit?: number
  }

  /**
   * Structure updateManyAndReturn
   */
  export type StructureUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Structure
     */
    select?: StructureSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Structure
     */
    omit?: StructureOmit<ExtArgs> | null
    /**
     * The data used to update Structures.
     */
    data: XOR<StructureUpdateManyMutationInput, StructureUncheckedUpdateManyInput>
    /**
     * Filter which Structures to update
     */
    where?: StructureWhereInput
    /**
     * Limit how many Structures to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StructureIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Structure upsert
   */
  export type StructureUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Structure
     */
    select?: StructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Structure
     */
    omit?: StructureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StructureInclude<ExtArgs> | null
    /**
     * The filter to search for the Structure to update in case it exists.
     */
    where: StructureWhereUniqueInput
    /**
     * In case the Structure found by the `where` argument doesn't exist, create a new Structure with this data.
     */
    create: XOR<StructureCreateInput, StructureUncheckedCreateInput>
    /**
     * In case the Structure was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StructureUpdateInput, StructureUncheckedUpdateInput>
  }

  /**
   * Structure delete
   */
  export type StructureDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Structure
     */
    select?: StructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Structure
     */
    omit?: StructureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StructureInclude<ExtArgs> | null
    /**
     * Filter which Structure to delete.
     */
    where: StructureWhereUniqueInput
  }

  /**
   * Structure deleteMany
   */
  export type StructureDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Structures to delete
     */
    where?: StructureWhereInput
    /**
     * Limit how many Structures to delete.
     */
    limit?: number
  }

  /**
   * Structure.userStructures
   */
  export type Structure$userStructuresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStructure
     */
    select?: UserStructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStructure
     */
    omit?: UserStructureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStructureInclude<ExtArgs> | null
    where?: UserStructureWhereInput
    orderBy?: UserStructureOrderByWithRelationInput | UserStructureOrderByWithRelationInput[]
    cursor?: UserStructureWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserStructureScalarFieldEnum | UserStructureScalarFieldEnum[]
  }

  /**
   * Structure.parent
   */
  export type Structure$parentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Structure
     */
    select?: StructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Structure
     */
    omit?: StructureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StructureInclude<ExtArgs> | null
    where?: StructureWhereInput
  }

  /**
   * Structure.children
   */
  export type Structure$childrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Structure
     */
    select?: StructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Structure
     */
    omit?: StructureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StructureInclude<ExtArgs> | null
    where?: StructureWhereInput
    orderBy?: StructureOrderByWithRelationInput | StructureOrderByWithRelationInput[]
    cursor?: StructureWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StructureScalarFieldEnum | StructureScalarFieldEnum[]
  }

  /**
   * Structure without action
   */
  export type StructureDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Structure
     */
    select?: StructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Structure
     */
    omit?: StructureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StructureInclude<ExtArgs> | null
  }


  /**
   * Model app_user
   */

  export type AggregateApp_user = {
    _count: App_userCountAggregateOutputType | null
    _min: App_userMinAggregateOutputType | null
    _max: App_userMaxAggregateOutputType | null
  }

  export type App_userMinAggregateOutputType = {
    user_id: string | null
    username: string | null
    email: string | null
    firstname: string | null
    lastname: string | null
    role: string | null
    created_at: Date | null
    active: boolean | null
  }

  export type App_userMaxAggregateOutputType = {
    user_id: string | null
    username: string | null
    email: string | null
    firstname: string | null
    lastname: string | null
    role: string | null
    created_at: Date | null
    active: boolean | null
  }

  export type App_userCountAggregateOutputType = {
    user_id: number
    username: number
    email: number
    firstname: number
    lastname: number
    role: number
    created_at: number
    active: number
    _all: number
  }


  export type App_userMinAggregateInputType = {
    user_id?: true
    username?: true
    email?: true
    firstname?: true
    lastname?: true
    role?: true
    created_at?: true
    active?: true
  }

  export type App_userMaxAggregateInputType = {
    user_id?: true
    username?: true
    email?: true
    firstname?: true
    lastname?: true
    role?: true
    created_at?: true
    active?: true
  }

  export type App_userCountAggregateInputType = {
    user_id?: true
    username?: true
    email?: true
    firstname?: true
    lastname?: true
    role?: true
    created_at?: true
    active?: true
    _all?: true
  }

  export type App_userAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which app_user to aggregate.
     */
    where?: app_userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of app_users to fetch.
     */
    orderBy?: app_userOrderByWithRelationInput | app_userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: app_userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` app_users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` app_users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned app_users
    **/
    _count?: true | App_userCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: App_userMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: App_userMaxAggregateInputType
  }

  export type GetApp_userAggregateType<T extends App_userAggregateArgs> = {
        [P in keyof T & keyof AggregateApp_user]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApp_user[P]>
      : GetScalarType<T[P], AggregateApp_user[P]>
  }




  export type app_userGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: app_userWhereInput
    orderBy?: app_userOrderByWithAggregationInput | app_userOrderByWithAggregationInput[]
    by: App_userScalarFieldEnum[] | App_userScalarFieldEnum
    having?: app_userScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: App_userCountAggregateInputType | true
    _min?: App_userMinAggregateInputType
    _max?: App_userMaxAggregateInputType
  }

  export type App_userGroupByOutputType = {
    user_id: string
    username: string
    email: string
    firstname: string
    lastname: string
    role: string
    created_at: Date
    active: boolean
    _count: App_userCountAggregateOutputType | null
    _min: App_userMinAggregateOutputType | null
    _max: App_userMaxAggregateOutputType | null
  }

  type GetApp_userGroupByPayload<T extends app_userGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<App_userGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof App_userGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], App_userGroupByOutputType[P]>
            : GetScalarType<T[P], App_userGroupByOutputType[P]>
        }
      >
    >


  export type app_userSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    username?: boolean
    email?: boolean
    firstname?: boolean
    lastname?: boolean
    role?: boolean
    created_at?: boolean
    active?: boolean
    auditLogs?: boolean | app_user$auditLogsArgs<ExtArgs>
    sessions?: boolean | app_user$sessionsArgs<ExtArgs>
    linksFrom?: boolean | app_user$linksFromArgs<ExtArgs>
    linksTo?: boolean | app_user$linksToArgs<ExtArgs>
    userStructures?: boolean | app_user$userStructuresArgs<ExtArgs>
    notifications?: boolean | app_user$notificationsArgs<ExtArgs>
    contentProgress?: boolean | app_user$contentProgressArgs<ExtArgs>
    _count?: boolean | App_userCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["app_user"]>

  export type app_userSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    username?: boolean
    email?: boolean
    firstname?: boolean
    lastname?: boolean
    role?: boolean
    created_at?: boolean
    active?: boolean
  }, ExtArgs["result"]["app_user"]>

  export type app_userSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    username?: boolean
    email?: boolean
    firstname?: boolean
    lastname?: boolean
    role?: boolean
    created_at?: boolean
    active?: boolean
  }, ExtArgs["result"]["app_user"]>

  export type app_userSelectScalar = {
    user_id?: boolean
    username?: boolean
    email?: boolean
    firstname?: boolean
    lastname?: boolean
    role?: boolean
    created_at?: boolean
    active?: boolean
  }

  export type app_userOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"user_id" | "username" | "email" | "firstname" | "lastname" | "role" | "created_at" | "active", ExtArgs["result"]["app_user"]>
  export type app_userInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditLogs?: boolean | app_user$auditLogsArgs<ExtArgs>
    sessions?: boolean | app_user$sessionsArgs<ExtArgs>
    linksFrom?: boolean | app_user$linksFromArgs<ExtArgs>
    linksTo?: boolean | app_user$linksToArgs<ExtArgs>
    userStructures?: boolean | app_user$userStructuresArgs<ExtArgs>
    notifications?: boolean | app_user$notificationsArgs<ExtArgs>
    contentProgress?: boolean | app_user$contentProgressArgs<ExtArgs>
    _count?: boolean | App_userCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type app_userIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type app_userIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $app_userPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "app_user"
    objects: {
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[]
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      linksFrom: Prisma.$UserLinkPayload<ExtArgs>[]
      linksTo: Prisma.$UserLinkPayload<ExtArgs>[]
      userStructures: Prisma.$UserStructurePayload<ExtArgs>[]
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
      contentProgress: Prisma.$UserContentProgressPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      user_id: string
      username: string
      email: string
      firstname: string
      lastname: string
      role: string
      created_at: Date
      active: boolean
    }, ExtArgs["result"]["app_user"]>
    composites: {}
  }

  type app_userGetPayload<S extends boolean | null | undefined | app_userDefaultArgs> = $Result.GetResult<Prisma.$app_userPayload, S>

  type app_userCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<app_userFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: App_userCountAggregateInputType | true
    }

  export interface app_userDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['app_user'], meta: { name: 'app_user' } }
    /**
     * Find zero or one App_user that matches the filter.
     * @param {app_userFindUniqueArgs} args - Arguments to find a App_user
     * @example
     * // Get one App_user
     * const app_user = await prisma.app_user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends app_userFindUniqueArgs>(args: SelectSubset<T, app_userFindUniqueArgs<ExtArgs>>): Prisma__app_userClient<$Result.GetResult<Prisma.$app_userPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one App_user that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {app_userFindUniqueOrThrowArgs} args - Arguments to find a App_user
     * @example
     * // Get one App_user
     * const app_user = await prisma.app_user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends app_userFindUniqueOrThrowArgs>(args: SelectSubset<T, app_userFindUniqueOrThrowArgs<ExtArgs>>): Prisma__app_userClient<$Result.GetResult<Prisma.$app_userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first App_user that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {app_userFindFirstArgs} args - Arguments to find a App_user
     * @example
     * // Get one App_user
     * const app_user = await prisma.app_user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends app_userFindFirstArgs>(args?: SelectSubset<T, app_userFindFirstArgs<ExtArgs>>): Prisma__app_userClient<$Result.GetResult<Prisma.$app_userPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first App_user that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {app_userFindFirstOrThrowArgs} args - Arguments to find a App_user
     * @example
     * // Get one App_user
     * const app_user = await prisma.app_user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends app_userFindFirstOrThrowArgs>(args?: SelectSubset<T, app_userFindFirstOrThrowArgs<ExtArgs>>): Prisma__app_userClient<$Result.GetResult<Prisma.$app_userPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more App_users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {app_userFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all App_users
     * const app_users = await prisma.app_user.findMany()
     * 
     * // Get first 10 App_users
     * const app_users = await prisma.app_user.findMany({ take: 10 })
     * 
     * // Only select the `user_id`
     * const app_userWithUser_idOnly = await prisma.app_user.findMany({ select: { user_id: true } })
     * 
     */
    findMany<T extends app_userFindManyArgs>(args?: SelectSubset<T, app_userFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$app_userPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a App_user.
     * @param {app_userCreateArgs} args - Arguments to create a App_user.
     * @example
     * // Create one App_user
     * const App_user = await prisma.app_user.create({
     *   data: {
     *     // ... data to create a App_user
     *   }
     * })
     * 
     */
    create<T extends app_userCreateArgs>(args: SelectSubset<T, app_userCreateArgs<ExtArgs>>): Prisma__app_userClient<$Result.GetResult<Prisma.$app_userPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many App_users.
     * @param {app_userCreateManyArgs} args - Arguments to create many App_users.
     * @example
     * // Create many App_users
     * const app_user = await prisma.app_user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends app_userCreateManyArgs>(args?: SelectSubset<T, app_userCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many App_users and returns the data saved in the database.
     * @param {app_userCreateManyAndReturnArgs} args - Arguments to create many App_users.
     * @example
     * // Create many App_users
     * const app_user = await prisma.app_user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many App_users and only return the `user_id`
     * const app_userWithUser_idOnly = await prisma.app_user.createManyAndReturn({
     *   select: { user_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends app_userCreateManyAndReturnArgs>(args?: SelectSubset<T, app_userCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$app_userPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a App_user.
     * @param {app_userDeleteArgs} args - Arguments to delete one App_user.
     * @example
     * // Delete one App_user
     * const App_user = await prisma.app_user.delete({
     *   where: {
     *     // ... filter to delete one App_user
     *   }
     * })
     * 
     */
    delete<T extends app_userDeleteArgs>(args: SelectSubset<T, app_userDeleteArgs<ExtArgs>>): Prisma__app_userClient<$Result.GetResult<Prisma.$app_userPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one App_user.
     * @param {app_userUpdateArgs} args - Arguments to update one App_user.
     * @example
     * // Update one App_user
     * const app_user = await prisma.app_user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends app_userUpdateArgs>(args: SelectSubset<T, app_userUpdateArgs<ExtArgs>>): Prisma__app_userClient<$Result.GetResult<Prisma.$app_userPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more App_users.
     * @param {app_userDeleteManyArgs} args - Arguments to filter App_users to delete.
     * @example
     * // Delete a few App_users
     * const { count } = await prisma.app_user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends app_userDeleteManyArgs>(args?: SelectSubset<T, app_userDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more App_users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {app_userUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many App_users
     * const app_user = await prisma.app_user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends app_userUpdateManyArgs>(args: SelectSubset<T, app_userUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more App_users and returns the data updated in the database.
     * @param {app_userUpdateManyAndReturnArgs} args - Arguments to update many App_users.
     * @example
     * // Update many App_users
     * const app_user = await prisma.app_user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more App_users and only return the `user_id`
     * const app_userWithUser_idOnly = await prisma.app_user.updateManyAndReturn({
     *   select: { user_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends app_userUpdateManyAndReturnArgs>(args: SelectSubset<T, app_userUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$app_userPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one App_user.
     * @param {app_userUpsertArgs} args - Arguments to update or create a App_user.
     * @example
     * // Update or create a App_user
     * const app_user = await prisma.app_user.upsert({
     *   create: {
     *     // ... data to create a App_user
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the App_user we want to update
     *   }
     * })
     */
    upsert<T extends app_userUpsertArgs>(args: SelectSubset<T, app_userUpsertArgs<ExtArgs>>): Prisma__app_userClient<$Result.GetResult<Prisma.$app_userPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of App_users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {app_userCountArgs} args - Arguments to filter App_users to count.
     * @example
     * // Count the number of App_users
     * const count = await prisma.app_user.count({
     *   where: {
     *     // ... the filter for the App_users we want to count
     *   }
     * })
    **/
    count<T extends app_userCountArgs>(
      args?: Subset<T, app_userCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], App_userCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a App_user.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {App_userAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends App_userAggregateArgs>(args: Subset<T, App_userAggregateArgs>): Prisma.PrismaPromise<GetApp_userAggregateType<T>>

    /**
     * Group by App_user.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {app_userGroupByArgs} args - Group by arguments.
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
      T extends app_userGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: app_userGroupByArgs['orderBy'] }
        : { orderBy?: app_userGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, app_userGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApp_userGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the app_user model
   */
  readonly fields: app_userFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for app_user.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__app_userClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    auditLogs<T extends app_user$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, app_user$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends app_user$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, app_user$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    linksFrom<T extends app_user$linksFromArgs<ExtArgs> = {}>(args?: Subset<T, app_user$linksFromArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserLinkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    linksTo<T extends app_user$linksToArgs<ExtArgs> = {}>(args?: Subset<T, app_user$linksToArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserLinkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    userStructures<T extends app_user$userStructuresArgs<ExtArgs> = {}>(args?: Subset<T, app_user$userStructuresArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserStructurePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notifications<T extends app_user$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, app_user$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    contentProgress<T extends app_user$contentProgressArgs<ExtArgs> = {}>(args?: Subset<T, app_user$contentProgressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserContentProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the app_user model
   */
  interface app_userFieldRefs {
    readonly user_id: FieldRef<"app_user", 'String'>
    readonly username: FieldRef<"app_user", 'String'>
    readonly email: FieldRef<"app_user", 'String'>
    readonly firstname: FieldRef<"app_user", 'String'>
    readonly lastname: FieldRef<"app_user", 'String'>
    readonly role: FieldRef<"app_user", 'String'>
    readonly created_at: FieldRef<"app_user", 'DateTime'>
    readonly active: FieldRef<"app_user", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * app_user findUnique
   */
  export type app_userFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_user
     */
    select?: app_userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_user
     */
    omit?: app_userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_userInclude<ExtArgs> | null
    /**
     * Filter, which app_user to fetch.
     */
    where: app_userWhereUniqueInput
  }

  /**
   * app_user findUniqueOrThrow
   */
  export type app_userFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_user
     */
    select?: app_userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_user
     */
    omit?: app_userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_userInclude<ExtArgs> | null
    /**
     * Filter, which app_user to fetch.
     */
    where: app_userWhereUniqueInput
  }

  /**
   * app_user findFirst
   */
  export type app_userFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_user
     */
    select?: app_userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_user
     */
    omit?: app_userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_userInclude<ExtArgs> | null
    /**
     * Filter, which app_user to fetch.
     */
    where?: app_userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of app_users to fetch.
     */
    orderBy?: app_userOrderByWithRelationInput | app_userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for app_users.
     */
    cursor?: app_userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` app_users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` app_users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of app_users.
     */
    distinct?: App_userScalarFieldEnum | App_userScalarFieldEnum[]
  }

  /**
   * app_user findFirstOrThrow
   */
  export type app_userFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_user
     */
    select?: app_userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_user
     */
    omit?: app_userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_userInclude<ExtArgs> | null
    /**
     * Filter, which app_user to fetch.
     */
    where?: app_userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of app_users to fetch.
     */
    orderBy?: app_userOrderByWithRelationInput | app_userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for app_users.
     */
    cursor?: app_userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` app_users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` app_users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of app_users.
     */
    distinct?: App_userScalarFieldEnum | App_userScalarFieldEnum[]
  }

  /**
   * app_user findMany
   */
  export type app_userFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_user
     */
    select?: app_userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_user
     */
    omit?: app_userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_userInclude<ExtArgs> | null
    /**
     * Filter, which app_users to fetch.
     */
    where?: app_userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of app_users to fetch.
     */
    orderBy?: app_userOrderByWithRelationInput | app_userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing app_users.
     */
    cursor?: app_userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` app_users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` app_users.
     */
    skip?: number
    distinct?: App_userScalarFieldEnum | App_userScalarFieldEnum[]
  }

  /**
   * app_user create
   */
  export type app_userCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_user
     */
    select?: app_userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_user
     */
    omit?: app_userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_userInclude<ExtArgs> | null
    /**
     * The data needed to create a app_user.
     */
    data: XOR<app_userCreateInput, app_userUncheckedCreateInput>
  }

  /**
   * app_user createMany
   */
  export type app_userCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many app_users.
     */
    data: app_userCreateManyInput | app_userCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * app_user createManyAndReturn
   */
  export type app_userCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_user
     */
    select?: app_userSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the app_user
     */
    omit?: app_userOmit<ExtArgs> | null
    /**
     * The data used to create many app_users.
     */
    data: app_userCreateManyInput | app_userCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * app_user update
   */
  export type app_userUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_user
     */
    select?: app_userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_user
     */
    omit?: app_userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_userInclude<ExtArgs> | null
    /**
     * The data needed to update a app_user.
     */
    data: XOR<app_userUpdateInput, app_userUncheckedUpdateInput>
    /**
     * Choose, which app_user to update.
     */
    where: app_userWhereUniqueInput
  }

  /**
   * app_user updateMany
   */
  export type app_userUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update app_users.
     */
    data: XOR<app_userUpdateManyMutationInput, app_userUncheckedUpdateManyInput>
    /**
     * Filter which app_users to update
     */
    where?: app_userWhereInput
    /**
     * Limit how many app_users to update.
     */
    limit?: number
  }

  /**
   * app_user updateManyAndReturn
   */
  export type app_userUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_user
     */
    select?: app_userSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the app_user
     */
    omit?: app_userOmit<ExtArgs> | null
    /**
     * The data used to update app_users.
     */
    data: XOR<app_userUpdateManyMutationInput, app_userUncheckedUpdateManyInput>
    /**
     * Filter which app_users to update
     */
    where?: app_userWhereInput
    /**
     * Limit how many app_users to update.
     */
    limit?: number
  }

  /**
   * app_user upsert
   */
  export type app_userUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_user
     */
    select?: app_userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_user
     */
    omit?: app_userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_userInclude<ExtArgs> | null
    /**
     * The filter to search for the app_user to update in case it exists.
     */
    where: app_userWhereUniqueInput
    /**
     * In case the app_user found by the `where` argument doesn't exist, create a new app_user with this data.
     */
    create: XOR<app_userCreateInput, app_userUncheckedCreateInput>
    /**
     * In case the app_user was found with the provided `where` argument, update it with this data.
     */
    update: XOR<app_userUpdateInput, app_userUncheckedUpdateInput>
  }

  /**
   * app_user delete
   */
  export type app_userDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_user
     */
    select?: app_userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_user
     */
    omit?: app_userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_userInclude<ExtArgs> | null
    /**
     * Filter which app_user to delete.
     */
    where: app_userWhereUniqueInput
  }

  /**
   * app_user deleteMany
   */
  export type app_userDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which app_users to delete
     */
    where?: app_userWhereInput
    /**
     * Limit how many app_users to delete.
     */
    limit?: number
  }

  /**
   * app_user.auditLogs
   */
  export type app_user$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * app_user.sessions
   */
  export type app_user$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * app_user.linksFrom
   */
  export type app_user$linksFromArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLink
     */
    select?: UserLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLink
     */
    omit?: UserLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLinkInclude<ExtArgs> | null
    where?: UserLinkWhereInput
    orderBy?: UserLinkOrderByWithRelationInput | UserLinkOrderByWithRelationInput[]
    cursor?: UserLinkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserLinkScalarFieldEnum | UserLinkScalarFieldEnum[]
  }

  /**
   * app_user.linksTo
   */
  export type app_user$linksToArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLink
     */
    select?: UserLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLink
     */
    omit?: UserLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLinkInclude<ExtArgs> | null
    where?: UserLinkWhereInput
    orderBy?: UserLinkOrderByWithRelationInput | UserLinkOrderByWithRelationInput[]
    cursor?: UserLinkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserLinkScalarFieldEnum | UserLinkScalarFieldEnum[]
  }

  /**
   * app_user.userStructures
   */
  export type app_user$userStructuresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStructure
     */
    select?: UserStructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStructure
     */
    omit?: UserStructureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStructureInclude<ExtArgs> | null
    where?: UserStructureWhereInput
    orderBy?: UserStructureOrderByWithRelationInput | UserStructureOrderByWithRelationInput[]
    cursor?: UserStructureWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserStructureScalarFieldEnum | UserStructureScalarFieldEnum[]
  }

  /**
   * app_user.notifications
   */
  export type app_user$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * app_user.contentProgress
   */
  export type app_user$contentProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserContentProgress
     */
    select?: UserContentProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserContentProgress
     */
    omit?: UserContentProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserContentProgressInclude<ExtArgs> | null
    where?: UserContentProgressWhereInput
    orderBy?: UserContentProgressOrderByWithRelationInput | UserContentProgressOrderByWithRelationInput[]
    cursor?: UserContentProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserContentProgressScalarFieldEnum | UserContentProgressScalarFieldEnum[]
  }

  /**
   * app_user without action
   */
  export type app_userDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_user
     */
    select?: app_userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_user
     */
    omit?: app_userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_userInclude<ExtArgs> | null
  }


  /**
   * Model UserLink
   */

  export type AggregateUserLink = {
    _count: UserLinkCountAggregateOutputType | null
    _min: UserLinkMinAggregateOutputType | null
    _max: UserLinkMaxAggregateOutputType | null
  }

  export type UserLinkMinAggregateOutputType = {
    link_id: string | null
    id_user_from: string | null
    id_user_to: string | null
    link_type: $Enums.linkType | null
    created_at: Date | null
  }

  export type UserLinkMaxAggregateOutputType = {
    link_id: string | null
    id_user_from: string | null
    id_user_to: string | null
    link_type: $Enums.linkType | null
    created_at: Date | null
  }

  export type UserLinkCountAggregateOutputType = {
    link_id: number
    id_user_from: number
    id_user_to: number
    link_type: number
    created_at: number
    _all: number
  }


  export type UserLinkMinAggregateInputType = {
    link_id?: true
    id_user_from?: true
    id_user_to?: true
    link_type?: true
    created_at?: true
  }

  export type UserLinkMaxAggregateInputType = {
    link_id?: true
    id_user_from?: true
    id_user_to?: true
    link_type?: true
    created_at?: true
  }

  export type UserLinkCountAggregateInputType = {
    link_id?: true
    id_user_from?: true
    id_user_to?: true
    link_type?: true
    created_at?: true
    _all?: true
  }

  export type UserLinkAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserLink to aggregate.
     */
    where?: UserLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserLinks to fetch.
     */
    orderBy?: UserLinkOrderByWithRelationInput | UserLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserLinks
    **/
    _count?: true | UserLinkCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserLinkMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserLinkMaxAggregateInputType
  }

  export type GetUserLinkAggregateType<T extends UserLinkAggregateArgs> = {
        [P in keyof T & keyof AggregateUserLink]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserLink[P]>
      : GetScalarType<T[P], AggregateUserLink[P]>
  }




  export type UserLinkGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserLinkWhereInput
    orderBy?: UserLinkOrderByWithAggregationInput | UserLinkOrderByWithAggregationInput[]
    by: UserLinkScalarFieldEnum[] | UserLinkScalarFieldEnum
    having?: UserLinkScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserLinkCountAggregateInputType | true
    _min?: UserLinkMinAggregateInputType
    _max?: UserLinkMaxAggregateInputType
  }

  export type UserLinkGroupByOutputType = {
    link_id: string
    id_user_from: string | null
    id_user_to: string | null
    link_type: $Enums.linkType
    created_at: Date
    _count: UserLinkCountAggregateOutputType | null
    _min: UserLinkMinAggregateOutputType | null
    _max: UserLinkMaxAggregateOutputType | null
  }

  type GetUserLinkGroupByPayload<T extends UserLinkGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserLinkGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserLinkGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserLinkGroupByOutputType[P]>
            : GetScalarType<T[P], UserLinkGroupByOutputType[P]>
        }
      >
    >


  export type UserLinkSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    link_id?: boolean
    id_user_from?: boolean
    id_user_to?: boolean
    link_type?: boolean
    created_at?: boolean
    userFrom?: boolean | UserLink$userFromArgs<ExtArgs>
    userTo?: boolean | UserLink$userToArgs<ExtArgs>
  }, ExtArgs["result"]["userLink"]>

  export type UserLinkSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    link_id?: boolean
    id_user_from?: boolean
    id_user_to?: boolean
    link_type?: boolean
    created_at?: boolean
    userFrom?: boolean | UserLink$userFromArgs<ExtArgs>
    userTo?: boolean | UserLink$userToArgs<ExtArgs>
  }, ExtArgs["result"]["userLink"]>

  export type UserLinkSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    link_id?: boolean
    id_user_from?: boolean
    id_user_to?: boolean
    link_type?: boolean
    created_at?: boolean
    userFrom?: boolean | UserLink$userFromArgs<ExtArgs>
    userTo?: boolean | UserLink$userToArgs<ExtArgs>
  }, ExtArgs["result"]["userLink"]>

  export type UserLinkSelectScalar = {
    link_id?: boolean
    id_user_from?: boolean
    id_user_to?: boolean
    link_type?: boolean
    created_at?: boolean
  }

  export type UserLinkOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"link_id" | "id_user_from" | "id_user_to" | "link_type" | "created_at", ExtArgs["result"]["userLink"]>
  export type UserLinkInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userFrom?: boolean | UserLink$userFromArgs<ExtArgs>
    userTo?: boolean | UserLink$userToArgs<ExtArgs>
  }
  export type UserLinkIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userFrom?: boolean | UserLink$userFromArgs<ExtArgs>
    userTo?: boolean | UserLink$userToArgs<ExtArgs>
  }
  export type UserLinkIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userFrom?: boolean | UserLink$userFromArgs<ExtArgs>
    userTo?: boolean | UserLink$userToArgs<ExtArgs>
  }

  export type $UserLinkPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserLink"
    objects: {
      userFrom: Prisma.$app_userPayload<ExtArgs> | null
      userTo: Prisma.$app_userPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      link_id: string
      id_user_from: string | null
      id_user_to: string | null
      link_type: $Enums.linkType
      created_at: Date
    }, ExtArgs["result"]["userLink"]>
    composites: {}
  }

  type UserLinkGetPayload<S extends boolean | null | undefined | UserLinkDefaultArgs> = $Result.GetResult<Prisma.$UserLinkPayload, S>

  type UserLinkCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserLinkFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserLinkCountAggregateInputType | true
    }

  export interface UserLinkDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserLink'], meta: { name: 'UserLink' } }
    /**
     * Find zero or one UserLink that matches the filter.
     * @param {UserLinkFindUniqueArgs} args - Arguments to find a UserLink
     * @example
     * // Get one UserLink
     * const userLink = await prisma.userLink.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserLinkFindUniqueArgs>(args: SelectSubset<T, UserLinkFindUniqueArgs<ExtArgs>>): Prisma__UserLinkClient<$Result.GetResult<Prisma.$UserLinkPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserLink that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserLinkFindUniqueOrThrowArgs} args - Arguments to find a UserLink
     * @example
     * // Get one UserLink
     * const userLink = await prisma.userLink.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserLinkFindUniqueOrThrowArgs>(args: SelectSubset<T, UserLinkFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserLinkClient<$Result.GetResult<Prisma.$UserLinkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserLink that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLinkFindFirstArgs} args - Arguments to find a UserLink
     * @example
     * // Get one UserLink
     * const userLink = await prisma.userLink.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserLinkFindFirstArgs>(args?: SelectSubset<T, UserLinkFindFirstArgs<ExtArgs>>): Prisma__UserLinkClient<$Result.GetResult<Prisma.$UserLinkPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserLink that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLinkFindFirstOrThrowArgs} args - Arguments to find a UserLink
     * @example
     * // Get one UserLink
     * const userLink = await prisma.userLink.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserLinkFindFirstOrThrowArgs>(args?: SelectSubset<T, UserLinkFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserLinkClient<$Result.GetResult<Prisma.$UserLinkPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserLinks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLinkFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserLinks
     * const userLinks = await prisma.userLink.findMany()
     * 
     * // Get first 10 UserLinks
     * const userLinks = await prisma.userLink.findMany({ take: 10 })
     * 
     * // Only select the `link_id`
     * const userLinkWithLink_idOnly = await prisma.userLink.findMany({ select: { link_id: true } })
     * 
     */
    findMany<T extends UserLinkFindManyArgs>(args?: SelectSubset<T, UserLinkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserLinkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserLink.
     * @param {UserLinkCreateArgs} args - Arguments to create a UserLink.
     * @example
     * // Create one UserLink
     * const UserLink = await prisma.userLink.create({
     *   data: {
     *     // ... data to create a UserLink
     *   }
     * })
     * 
     */
    create<T extends UserLinkCreateArgs>(args: SelectSubset<T, UserLinkCreateArgs<ExtArgs>>): Prisma__UserLinkClient<$Result.GetResult<Prisma.$UserLinkPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserLinks.
     * @param {UserLinkCreateManyArgs} args - Arguments to create many UserLinks.
     * @example
     * // Create many UserLinks
     * const userLink = await prisma.userLink.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserLinkCreateManyArgs>(args?: SelectSubset<T, UserLinkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserLinks and returns the data saved in the database.
     * @param {UserLinkCreateManyAndReturnArgs} args - Arguments to create many UserLinks.
     * @example
     * // Create many UserLinks
     * const userLink = await prisma.userLink.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserLinks and only return the `link_id`
     * const userLinkWithLink_idOnly = await prisma.userLink.createManyAndReturn({
     *   select: { link_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserLinkCreateManyAndReturnArgs>(args?: SelectSubset<T, UserLinkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserLinkPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserLink.
     * @param {UserLinkDeleteArgs} args - Arguments to delete one UserLink.
     * @example
     * // Delete one UserLink
     * const UserLink = await prisma.userLink.delete({
     *   where: {
     *     // ... filter to delete one UserLink
     *   }
     * })
     * 
     */
    delete<T extends UserLinkDeleteArgs>(args: SelectSubset<T, UserLinkDeleteArgs<ExtArgs>>): Prisma__UserLinkClient<$Result.GetResult<Prisma.$UserLinkPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserLink.
     * @param {UserLinkUpdateArgs} args - Arguments to update one UserLink.
     * @example
     * // Update one UserLink
     * const userLink = await prisma.userLink.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserLinkUpdateArgs>(args: SelectSubset<T, UserLinkUpdateArgs<ExtArgs>>): Prisma__UserLinkClient<$Result.GetResult<Prisma.$UserLinkPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserLinks.
     * @param {UserLinkDeleteManyArgs} args - Arguments to filter UserLinks to delete.
     * @example
     * // Delete a few UserLinks
     * const { count } = await prisma.userLink.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserLinkDeleteManyArgs>(args?: SelectSubset<T, UserLinkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserLinks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLinkUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserLinks
     * const userLink = await prisma.userLink.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserLinkUpdateManyArgs>(args: SelectSubset<T, UserLinkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserLinks and returns the data updated in the database.
     * @param {UserLinkUpdateManyAndReturnArgs} args - Arguments to update many UserLinks.
     * @example
     * // Update many UserLinks
     * const userLink = await prisma.userLink.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserLinks and only return the `link_id`
     * const userLinkWithLink_idOnly = await prisma.userLink.updateManyAndReturn({
     *   select: { link_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserLinkUpdateManyAndReturnArgs>(args: SelectSubset<T, UserLinkUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserLinkPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserLink.
     * @param {UserLinkUpsertArgs} args - Arguments to update or create a UserLink.
     * @example
     * // Update or create a UserLink
     * const userLink = await prisma.userLink.upsert({
     *   create: {
     *     // ... data to create a UserLink
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserLink we want to update
     *   }
     * })
     */
    upsert<T extends UserLinkUpsertArgs>(args: SelectSubset<T, UserLinkUpsertArgs<ExtArgs>>): Prisma__UserLinkClient<$Result.GetResult<Prisma.$UserLinkPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserLinks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLinkCountArgs} args - Arguments to filter UserLinks to count.
     * @example
     * // Count the number of UserLinks
     * const count = await prisma.userLink.count({
     *   where: {
     *     // ... the filter for the UserLinks we want to count
     *   }
     * })
    **/
    count<T extends UserLinkCountArgs>(
      args?: Subset<T, UserLinkCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserLinkCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserLink.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLinkAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserLinkAggregateArgs>(args: Subset<T, UserLinkAggregateArgs>): Prisma.PrismaPromise<GetUserLinkAggregateType<T>>

    /**
     * Group by UserLink.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLinkGroupByArgs} args - Group by arguments.
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
      T extends UserLinkGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserLinkGroupByArgs['orderBy'] }
        : { orderBy?: UserLinkGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserLinkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserLinkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserLink model
   */
  readonly fields: UserLinkFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserLink.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserLinkClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    userFrom<T extends UserLink$userFromArgs<ExtArgs> = {}>(args?: Subset<T, UserLink$userFromArgs<ExtArgs>>): Prisma__app_userClient<$Result.GetResult<Prisma.$app_userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    userTo<T extends UserLink$userToArgs<ExtArgs> = {}>(args?: Subset<T, UserLink$userToArgs<ExtArgs>>): Prisma__app_userClient<$Result.GetResult<Prisma.$app_userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the UserLink model
   */
  interface UserLinkFieldRefs {
    readonly link_id: FieldRef<"UserLink", 'String'>
    readonly id_user_from: FieldRef<"UserLink", 'String'>
    readonly id_user_to: FieldRef<"UserLink", 'String'>
    readonly link_type: FieldRef<"UserLink", 'linkType'>
    readonly created_at: FieldRef<"UserLink", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserLink findUnique
   */
  export type UserLinkFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLink
     */
    select?: UserLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLink
     */
    omit?: UserLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLinkInclude<ExtArgs> | null
    /**
     * Filter, which UserLink to fetch.
     */
    where: UserLinkWhereUniqueInput
  }

  /**
   * UserLink findUniqueOrThrow
   */
  export type UserLinkFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLink
     */
    select?: UserLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLink
     */
    omit?: UserLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLinkInclude<ExtArgs> | null
    /**
     * Filter, which UserLink to fetch.
     */
    where: UserLinkWhereUniqueInput
  }

  /**
   * UserLink findFirst
   */
  export type UserLinkFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLink
     */
    select?: UserLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLink
     */
    omit?: UserLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLinkInclude<ExtArgs> | null
    /**
     * Filter, which UserLink to fetch.
     */
    where?: UserLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserLinks to fetch.
     */
    orderBy?: UserLinkOrderByWithRelationInput | UserLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserLinks.
     */
    cursor?: UserLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserLinks.
     */
    distinct?: UserLinkScalarFieldEnum | UserLinkScalarFieldEnum[]
  }

  /**
   * UserLink findFirstOrThrow
   */
  export type UserLinkFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLink
     */
    select?: UserLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLink
     */
    omit?: UserLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLinkInclude<ExtArgs> | null
    /**
     * Filter, which UserLink to fetch.
     */
    where?: UserLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserLinks to fetch.
     */
    orderBy?: UserLinkOrderByWithRelationInput | UserLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserLinks.
     */
    cursor?: UserLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserLinks.
     */
    distinct?: UserLinkScalarFieldEnum | UserLinkScalarFieldEnum[]
  }

  /**
   * UserLink findMany
   */
  export type UserLinkFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLink
     */
    select?: UserLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLink
     */
    omit?: UserLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLinkInclude<ExtArgs> | null
    /**
     * Filter, which UserLinks to fetch.
     */
    where?: UserLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserLinks to fetch.
     */
    orderBy?: UserLinkOrderByWithRelationInput | UserLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserLinks.
     */
    cursor?: UserLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserLinks.
     */
    skip?: number
    distinct?: UserLinkScalarFieldEnum | UserLinkScalarFieldEnum[]
  }

  /**
   * UserLink create
   */
  export type UserLinkCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLink
     */
    select?: UserLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLink
     */
    omit?: UserLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLinkInclude<ExtArgs> | null
    /**
     * The data needed to create a UserLink.
     */
    data: XOR<UserLinkCreateInput, UserLinkUncheckedCreateInput>
  }

  /**
   * UserLink createMany
   */
  export type UserLinkCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserLinks.
     */
    data: UserLinkCreateManyInput | UserLinkCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserLink createManyAndReturn
   */
  export type UserLinkCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLink
     */
    select?: UserLinkSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserLink
     */
    omit?: UserLinkOmit<ExtArgs> | null
    /**
     * The data used to create many UserLinks.
     */
    data: UserLinkCreateManyInput | UserLinkCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLinkIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserLink update
   */
  export type UserLinkUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLink
     */
    select?: UserLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLink
     */
    omit?: UserLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLinkInclude<ExtArgs> | null
    /**
     * The data needed to update a UserLink.
     */
    data: XOR<UserLinkUpdateInput, UserLinkUncheckedUpdateInput>
    /**
     * Choose, which UserLink to update.
     */
    where: UserLinkWhereUniqueInput
  }

  /**
   * UserLink updateMany
   */
  export type UserLinkUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserLinks.
     */
    data: XOR<UserLinkUpdateManyMutationInput, UserLinkUncheckedUpdateManyInput>
    /**
     * Filter which UserLinks to update
     */
    where?: UserLinkWhereInput
    /**
     * Limit how many UserLinks to update.
     */
    limit?: number
  }

  /**
   * UserLink updateManyAndReturn
   */
  export type UserLinkUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLink
     */
    select?: UserLinkSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserLink
     */
    omit?: UserLinkOmit<ExtArgs> | null
    /**
     * The data used to update UserLinks.
     */
    data: XOR<UserLinkUpdateManyMutationInput, UserLinkUncheckedUpdateManyInput>
    /**
     * Filter which UserLinks to update
     */
    where?: UserLinkWhereInput
    /**
     * Limit how many UserLinks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLinkIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserLink upsert
   */
  export type UserLinkUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLink
     */
    select?: UserLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLink
     */
    omit?: UserLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLinkInclude<ExtArgs> | null
    /**
     * The filter to search for the UserLink to update in case it exists.
     */
    where: UserLinkWhereUniqueInput
    /**
     * In case the UserLink found by the `where` argument doesn't exist, create a new UserLink with this data.
     */
    create: XOR<UserLinkCreateInput, UserLinkUncheckedCreateInput>
    /**
     * In case the UserLink was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserLinkUpdateInput, UserLinkUncheckedUpdateInput>
  }

  /**
   * UserLink delete
   */
  export type UserLinkDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLink
     */
    select?: UserLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLink
     */
    omit?: UserLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLinkInclude<ExtArgs> | null
    /**
     * Filter which UserLink to delete.
     */
    where: UserLinkWhereUniqueInput
  }

  /**
   * UserLink deleteMany
   */
  export type UserLinkDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserLinks to delete
     */
    where?: UserLinkWhereInput
    /**
     * Limit how many UserLinks to delete.
     */
    limit?: number
  }

  /**
   * UserLink.userFrom
   */
  export type UserLink$userFromArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_user
     */
    select?: app_userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_user
     */
    omit?: app_userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_userInclude<ExtArgs> | null
    where?: app_userWhereInput
  }

  /**
   * UserLink.userTo
   */
  export type UserLink$userToArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_user
     */
    select?: app_userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_user
     */
    omit?: app_userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_userInclude<ExtArgs> | null
    where?: app_userWhereInput
  }

  /**
   * UserLink without action
   */
  export type UserLinkDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLink
     */
    select?: UserLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLink
     */
    omit?: UserLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLinkInclude<ExtArgs> | null
  }


  /**
   * Model UserStructure
   */

  export type AggregateUserStructure = {
    _count: UserStructureCountAggregateOutputType | null
    _min: UserStructureMinAggregateOutputType | null
    _max: UserStructureMaxAggregateOutputType | null
  }

  export type UserStructureMinAggregateOutputType = {
    user_id: string | null
    structure_id: string | null
  }

  export type UserStructureMaxAggregateOutputType = {
    user_id: string | null
    structure_id: string | null
  }

  export type UserStructureCountAggregateOutputType = {
    user_id: number
    structure_id: number
    _all: number
  }


  export type UserStructureMinAggregateInputType = {
    user_id?: true
    structure_id?: true
  }

  export type UserStructureMaxAggregateInputType = {
    user_id?: true
    structure_id?: true
  }

  export type UserStructureCountAggregateInputType = {
    user_id?: true
    structure_id?: true
    _all?: true
  }

  export type UserStructureAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserStructure to aggregate.
     */
    where?: UserStructureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserStructures to fetch.
     */
    orderBy?: UserStructureOrderByWithRelationInput | UserStructureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserStructureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserStructures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserStructures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserStructures
    **/
    _count?: true | UserStructureCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserStructureMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserStructureMaxAggregateInputType
  }

  export type GetUserStructureAggregateType<T extends UserStructureAggregateArgs> = {
        [P in keyof T & keyof AggregateUserStructure]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserStructure[P]>
      : GetScalarType<T[P], AggregateUserStructure[P]>
  }




  export type UserStructureGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserStructureWhereInput
    orderBy?: UserStructureOrderByWithAggregationInput | UserStructureOrderByWithAggregationInput[]
    by: UserStructureScalarFieldEnum[] | UserStructureScalarFieldEnum
    having?: UserStructureScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserStructureCountAggregateInputType | true
    _min?: UserStructureMinAggregateInputType
    _max?: UserStructureMaxAggregateInputType
  }

  export type UserStructureGroupByOutputType = {
    user_id: string
    structure_id: string
    _count: UserStructureCountAggregateOutputType | null
    _min: UserStructureMinAggregateOutputType | null
    _max: UserStructureMaxAggregateOutputType | null
  }

  type GetUserStructureGroupByPayload<T extends UserStructureGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserStructureGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserStructureGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserStructureGroupByOutputType[P]>
            : GetScalarType<T[P], UserStructureGroupByOutputType[P]>
        }
      >
    >


  export type UserStructureSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    structure_id?: boolean
    structure?: boolean | StructureDefaultArgs<ExtArgs>
    user?: boolean | app_userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userStructure"]>

  export type UserStructureSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    structure_id?: boolean
    structure?: boolean | StructureDefaultArgs<ExtArgs>
    user?: boolean | app_userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userStructure"]>

  export type UserStructureSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    structure_id?: boolean
    structure?: boolean | StructureDefaultArgs<ExtArgs>
    user?: boolean | app_userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userStructure"]>

  export type UserStructureSelectScalar = {
    user_id?: boolean
    structure_id?: boolean
  }

  export type UserStructureOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"user_id" | "structure_id", ExtArgs["result"]["userStructure"]>
  export type UserStructureInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    structure?: boolean | StructureDefaultArgs<ExtArgs>
    user?: boolean | app_userDefaultArgs<ExtArgs>
  }
  export type UserStructureIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    structure?: boolean | StructureDefaultArgs<ExtArgs>
    user?: boolean | app_userDefaultArgs<ExtArgs>
  }
  export type UserStructureIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    structure?: boolean | StructureDefaultArgs<ExtArgs>
    user?: boolean | app_userDefaultArgs<ExtArgs>
  }

  export type $UserStructurePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserStructure"
    objects: {
      structure: Prisma.$StructurePayload<ExtArgs>
      user: Prisma.$app_userPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      user_id: string
      structure_id: string
    }, ExtArgs["result"]["userStructure"]>
    composites: {}
  }

  type UserStructureGetPayload<S extends boolean | null | undefined | UserStructureDefaultArgs> = $Result.GetResult<Prisma.$UserStructurePayload, S>

  type UserStructureCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserStructureFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserStructureCountAggregateInputType | true
    }

  export interface UserStructureDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserStructure'], meta: { name: 'UserStructure' } }
    /**
     * Find zero or one UserStructure that matches the filter.
     * @param {UserStructureFindUniqueArgs} args - Arguments to find a UserStructure
     * @example
     * // Get one UserStructure
     * const userStructure = await prisma.userStructure.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserStructureFindUniqueArgs>(args: SelectSubset<T, UserStructureFindUniqueArgs<ExtArgs>>): Prisma__UserStructureClient<$Result.GetResult<Prisma.$UserStructurePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserStructure that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserStructureFindUniqueOrThrowArgs} args - Arguments to find a UserStructure
     * @example
     * // Get one UserStructure
     * const userStructure = await prisma.userStructure.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserStructureFindUniqueOrThrowArgs>(args: SelectSubset<T, UserStructureFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserStructureClient<$Result.GetResult<Prisma.$UserStructurePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserStructure that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStructureFindFirstArgs} args - Arguments to find a UserStructure
     * @example
     * // Get one UserStructure
     * const userStructure = await prisma.userStructure.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserStructureFindFirstArgs>(args?: SelectSubset<T, UserStructureFindFirstArgs<ExtArgs>>): Prisma__UserStructureClient<$Result.GetResult<Prisma.$UserStructurePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserStructure that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStructureFindFirstOrThrowArgs} args - Arguments to find a UserStructure
     * @example
     * // Get one UserStructure
     * const userStructure = await prisma.userStructure.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserStructureFindFirstOrThrowArgs>(args?: SelectSubset<T, UserStructureFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserStructureClient<$Result.GetResult<Prisma.$UserStructurePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserStructures that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStructureFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserStructures
     * const userStructures = await prisma.userStructure.findMany()
     * 
     * // Get first 10 UserStructures
     * const userStructures = await prisma.userStructure.findMany({ take: 10 })
     * 
     * // Only select the `user_id`
     * const userStructureWithUser_idOnly = await prisma.userStructure.findMany({ select: { user_id: true } })
     * 
     */
    findMany<T extends UserStructureFindManyArgs>(args?: SelectSubset<T, UserStructureFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserStructurePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserStructure.
     * @param {UserStructureCreateArgs} args - Arguments to create a UserStructure.
     * @example
     * // Create one UserStructure
     * const UserStructure = await prisma.userStructure.create({
     *   data: {
     *     // ... data to create a UserStructure
     *   }
     * })
     * 
     */
    create<T extends UserStructureCreateArgs>(args: SelectSubset<T, UserStructureCreateArgs<ExtArgs>>): Prisma__UserStructureClient<$Result.GetResult<Prisma.$UserStructurePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserStructures.
     * @param {UserStructureCreateManyArgs} args - Arguments to create many UserStructures.
     * @example
     * // Create many UserStructures
     * const userStructure = await prisma.userStructure.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserStructureCreateManyArgs>(args?: SelectSubset<T, UserStructureCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserStructures and returns the data saved in the database.
     * @param {UserStructureCreateManyAndReturnArgs} args - Arguments to create many UserStructures.
     * @example
     * // Create many UserStructures
     * const userStructure = await prisma.userStructure.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserStructures and only return the `user_id`
     * const userStructureWithUser_idOnly = await prisma.userStructure.createManyAndReturn({
     *   select: { user_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserStructureCreateManyAndReturnArgs>(args?: SelectSubset<T, UserStructureCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserStructurePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserStructure.
     * @param {UserStructureDeleteArgs} args - Arguments to delete one UserStructure.
     * @example
     * // Delete one UserStructure
     * const UserStructure = await prisma.userStructure.delete({
     *   where: {
     *     // ... filter to delete one UserStructure
     *   }
     * })
     * 
     */
    delete<T extends UserStructureDeleteArgs>(args: SelectSubset<T, UserStructureDeleteArgs<ExtArgs>>): Prisma__UserStructureClient<$Result.GetResult<Prisma.$UserStructurePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserStructure.
     * @param {UserStructureUpdateArgs} args - Arguments to update one UserStructure.
     * @example
     * // Update one UserStructure
     * const userStructure = await prisma.userStructure.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserStructureUpdateArgs>(args: SelectSubset<T, UserStructureUpdateArgs<ExtArgs>>): Prisma__UserStructureClient<$Result.GetResult<Prisma.$UserStructurePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserStructures.
     * @param {UserStructureDeleteManyArgs} args - Arguments to filter UserStructures to delete.
     * @example
     * // Delete a few UserStructures
     * const { count } = await prisma.userStructure.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserStructureDeleteManyArgs>(args?: SelectSubset<T, UserStructureDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserStructures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStructureUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserStructures
     * const userStructure = await prisma.userStructure.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserStructureUpdateManyArgs>(args: SelectSubset<T, UserStructureUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserStructures and returns the data updated in the database.
     * @param {UserStructureUpdateManyAndReturnArgs} args - Arguments to update many UserStructures.
     * @example
     * // Update many UserStructures
     * const userStructure = await prisma.userStructure.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserStructures and only return the `user_id`
     * const userStructureWithUser_idOnly = await prisma.userStructure.updateManyAndReturn({
     *   select: { user_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserStructureUpdateManyAndReturnArgs>(args: SelectSubset<T, UserStructureUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserStructurePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserStructure.
     * @param {UserStructureUpsertArgs} args - Arguments to update or create a UserStructure.
     * @example
     * // Update or create a UserStructure
     * const userStructure = await prisma.userStructure.upsert({
     *   create: {
     *     // ... data to create a UserStructure
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserStructure we want to update
     *   }
     * })
     */
    upsert<T extends UserStructureUpsertArgs>(args: SelectSubset<T, UserStructureUpsertArgs<ExtArgs>>): Prisma__UserStructureClient<$Result.GetResult<Prisma.$UserStructurePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserStructures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStructureCountArgs} args - Arguments to filter UserStructures to count.
     * @example
     * // Count the number of UserStructures
     * const count = await prisma.userStructure.count({
     *   where: {
     *     // ... the filter for the UserStructures we want to count
     *   }
     * })
    **/
    count<T extends UserStructureCountArgs>(
      args?: Subset<T, UserStructureCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserStructureCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserStructure.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStructureAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserStructureAggregateArgs>(args: Subset<T, UserStructureAggregateArgs>): Prisma.PrismaPromise<GetUserStructureAggregateType<T>>

    /**
     * Group by UserStructure.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStructureGroupByArgs} args - Group by arguments.
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
      T extends UserStructureGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserStructureGroupByArgs['orderBy'] }
        : { orderBy?: UserStructureGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserStructureGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserStructureGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserStructure model
   */
  readonly fields: UserStructureFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserStructure.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserStructureClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    structure<T extends StructureDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StructureDefaultArgs<ExtArgs>>): Prisma__StructureClient<$Result.GetResult<Prisma.$StructurePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends app_userDefaultArgs<ExtArgs> = {}>(args?: Subset<T, app_userDefaultArgs<ExtArgs>>): Prisma__app_userClient<$Result.GetResult<Prisma.$app_userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the UserStructure model
   */
  interface UserStructureFieldRefs {
    readonly user_id: FieldRef<"UserStructure", 'String'>
    readonly structure_id: FieldRef<"UserStructure", 'String'>
  }
    

  // Custom InputTypes
  /**
   * UserStructure findUnique
   */
  export type UserStructureFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStructure
     */
    select?: UserStructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStructure
     */
    omit?: UserStructureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStructureInclude<ExtArgs> | null
    /**
     * Filter, which UserStructure to fetch.
     */
    where: UserStructureWhereUniqueInput
  }

  /**
   * UserStructure findUniqueOrThrow
   */
  export type UserStructureFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStructure
     */
    select?: UserStructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStructure
     */
    omit?: UserStructureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStructureInclude<ExtArgs> | null
    /**
     * Filter, which UserStructure to fetch.
     */
    where: UserStructureWhereUniqueInput
  }

  /**
   * UserStructure findFirst
   */
  export type UserStructureFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStructure
     */
    select?: UserStructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStructure
     */
    omit?: UserStructureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStructureInclude<ExtArgs> | null
    /**
     * Filter, which UserStructure to fetch.
     */
    where?: UserStructureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserStructures to fetch.
     */
    orderBy?: UserStructureOrderByWithRelationInput | UserStructureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserStructures.
     */
    cursor?: UserStructureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserStructures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserStructures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserStructures.
     */
    distinct?: UserStructureScalarFieldEnum | UserStructureScalarFieldEnum[]
  }

  /**
   * UserStructure findFirstOrThrow
   */
  export type UserStructureFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStructure
     */
    select?: UserStructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStructure
     */
    omit?: UserStructureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStructureInclude<ExtArgs> | null
    /**
     * Filter, which UserStructure to fetch.
     */
    where?: UserStructureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserStructures to fetch.
     */
    orderBy?: UserStructureOrderByWithRelationInput | UserStructureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserStructures.
     */
    cursor?: UserStructureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserStructures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserStructures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserStructures.
     */
    distinct?: UserStructureScalarFieldEnum | UserStructureScalarFieldEnum[]
  }

  /**
   * UserStructure findMany
   */
  export type UserStructureFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStructure
     */
    select?: UserStructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStructure
     */
    omit?: UserStructureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStructureInclude<ExtArgs> | null
    /**
     * Filter, which UserStructures to fetch.
     */
    where?: UserStructureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserStructures to fetch.
     */
    orderBy?: UserStructureOrderByWithRelationInput | UserStructureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserStructures.
     */
    cursor?: UserStructureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserStructures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserStructures.
     */
    skip?: number
    distinct?: UserStructureScalarFieldEnum | UserStructureScalarFieldEnum[]
  }

  /**
   * UserStructure create
   */
  export type UserStructureCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStructure
     */
    select?: UserStructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStructure
     */
    omit?: UserStructureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStructureInclude<ExtArgs> | null
    /**
     * The data needed to create a UserStructure.
     */
    data: XOR<UserStructureCreateInput, UserStructureUncheckedCreateInput>
  }

  /**
   * UserStructure createMany
   */
  export type UserStructureCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserStructures.
     */
    data: UserStructureCreateManyInput | UserStructureCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserStructure createManyAndReturn
   */
  export type UserStructureCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStructure
     */
    select?: UserStructureSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserStructure
     */
    omit?: UserStructureOmit<ExtArgs> | null
    /**
     * The data used to create many UserStructures.
     */
    data: UserStructureCreateManyInput | UserStructureCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStructureIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserStructure update
   */
  export type UserStructureUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStructure
     */
    select?: UserStructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStructure
     */
    omit?: UserStructureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStructureInclude<ExtArgs> | null
    /**
     * The data needed to update a UserStructure.
     */
    data: XOR<UserStructureUpdateInput, UserStructureUncheckedUpdateInput>
    /**
     * Choose, which UserStructure to update.
     */
    where: UserStructureWhereUniqueInput
  }

  /**
   * UserStructure updateMany
   */
  export type UserStructureUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserStructures.
     */
    data: XOR<UserStructureUpdateManyMutationInput, UserStructureUncheckedUpdateManyInput>
    /**
     * Filter which UserStructures to update
     */
    where?: UserStructureWhereInput
    /**
     * Limit how many UserStructures to update.
     */
    limit?: number
  }

  /**
   * UserStructure updateManyAndReturn
   */
  export type UserStructureUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStructure
     */
    select?: UserStructureSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserStructure
     */
    omit?: UserStructureOmit<ExtArgs> | null
    /**
     * The data used to update UserStructures.
     */
    data: XOR<UserStructureUpdateManyMutationInput, UserStructureUncheckedUpdateManyInput>
    /**
     * Filter which UserStructures to update
     */
    where?: UserStructureWhereInput
    /**
     * Limit how many UserStructures to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStructureIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserStructure upsert
   */
  export type UserStructureUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStructure
     */
    select?: UserStructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStructure
     */
    omit?: UserStructureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStructureInclude<ExtArgs> | null
    /**
     * The filter to search for the UserStructure to update in case it exists.
     */
    where: UserStructureWhereUniqueInput
    /**
     * In case the UserStructure found by the `where` argument doesn't exist, create a new UserStructure with this data.
     */
    create: XOR<UserStructureCreateInput, UserStructureUncheckedCreateInput>
    /**
     * In case the UserStructure was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserStructureUpdateInput, UserStructureUncheckedUpdateInput>
  }

  /**
   * UserStructure delete
   */
  export type UserStructureDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStructure
     */
    select?: UserStructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStructure
     */
    omit?: UserStructureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStructureInclude<ExtArgs> | null
    /**
     * Filter which UserStructure to delete.
     */
    where: UserStructureWhereUniqueInput
  }

  /**
   * UserStructure deleteMany
   */
  export type UserStructureDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserStructures to delete
     */
    where?: UserStructureWhereInput
    /**
     * Limit how many UserStructures to delete.
     */
    limit?: number
  }

  /**
   * UserStructure without action
   */
  export type UserStructureDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStructure
     */
    select?: UserStructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStructure
     */
    omit?: UserStructureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStructureInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    session_id: string | null
    user_id: string | null
    token: string | null
    created_at: Date | null
    expires_at: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    session_id: string | null
    user_id: string | null
    token: string | null
    created_at: Date | null
    expires_at: Date | null
  }

  export type SessionCountAggregateOutputType = {
    session_id: number
    user_id: number
    token: number
    created_at: number
    expires_at: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    session_id?: true
    user_id?: true
    token?: true
    created_at?: true
    expires_at?: true
  }

  export type SessionMaxAggregateInputType = {
    session_id?: true
    user_id?: true
    token?: true
    created_at?: true
    expires_at?: true
  }

  export type SessionCountAggregateInputType = {
    session_id?: true
    user_id?: true
    token?: true
    created_at?: true
    expires_at?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    session_id: string
    user_id: string | null
    token: string
    created_at: Date
    expires_at: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    session_id?: boolean
    user_id?: boolean
    token?: boolean
    created_at?: boolean
    expires_at?: boolean
    user?: boolean | Session$userArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    session_id?: boolean
    user_id?: boolean
    token?: boolean
    created_at?: boolean
    expires_at?: boolean
    user?: boolean | Session$userArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    session_id?: boolean
    user_id?: boolean
    token?: boolean
    created_at?: boolean
    expires_at?: boolean
    user?: boolean | Session$userArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    session_id?: boolean
    user_id?: boolean
    token?: boolean
    created_at?: boolean
    expires_at?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"session_id" | "user_id" | "token" | "created_at" | "expires_at", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Session$userArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Session$userArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Session$userArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$app_userPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      session_id: string
      user_id: string | null
      token: string
      created_at: Date
      expires_at: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `session_id`
     * const sessionWithSession_idOnly = await prisma.session.findMany({ select: { session_id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `session_id`
     * const sessionWithSession_idOnly = await prisma.session.createManyAndReturn({
     *   select: { session_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `session_id`
     * const sessionWithSession_idOnly = await prisma.session.updateManyAndReturn({
     *   select: { session_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
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
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Session$userArgs<ExtArgs> = {}>(args?: Subset<T, Session$userArgs<ExtArgs>>): Prisma__app_userClient<$Result.GetResult<Prisma.$app_userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly session_id: FieldRef<"Session", 'String'>
    readonly user_id: FieldRef<"Session", 'String'>
    readonly token: FieldRef<"Session", 'String'>
    readonly created_at: FieldRef<"Session", 'DateTime'>
    readonly expires_at: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session.user
   */
  export type Session$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_user
     */
    select?: app_userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_user
     */
    omit?: app_userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_userInclude<ExtArgs> | null
    where?: app_userWhereInput
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model Dimension
   */

  export type AggregateDimension = {
    _count: DimensionCountAggregateOutputType | null
    _min: DimensionMinAggregateOutputType | null
    _max: DimensionMaxAggregateOutputType | null
  }

  export type DimensionMinAggregateOutputType = {
    dimension_id: string | null
    name: string | null
    description: string | null
  }

  export type DimensionMaxAggregateOutputType = {
    dimension_id: string | null
    name: string | null
    description: string | null
  }

  export type DimensionCountAggregateOutputType = {
    dimension_id: number
    name: number
    description: number
    _all: number
  }


  export type DimensionMinAggregateInputType = {
    dimension_id?: true
    name?: true
    description?: true
  }

  export type DimensionMaxAggregateInputType = {
    dimension_id?: true
    name?: true
    description?: true
  }

  export type DimensionCountAggregateInputType = {
    dimension_id?: true
    name?: true
    description?: true
    _all?: true
  }

  export type DimensionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Dimension to aggregate.
     */
    where?: DimensionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dimensions to fetch.
     */
    orderBy?: DimensionOrderByWithRelationInput | DimensionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DimensionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dimensions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dimensions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Dimensions
    **/
    _count?: true | DimensionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DimensionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DimensionMaxAggregateInputType
  }

  export type GetDimensionAggregateType<T extends DimensionAggregateArgs> = {
        [P in keyof T & keyof AggregateDimension]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDimension[P]>
      : GetScalarType<T[P], AggregateDimension[P]>
  }




  export type DimensionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DimensionWhereInput
    orderBy?: DimensionOrderByWithAggregationInput | DimensionOrderByWithAggregationInput[]
    by: DimensionScalarFieldEnum[] | DimensionScalarFieldEnum
    having?: DimensionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DimensionCountAggregateInputType | true
    _min?: DimensionMinAggregateInputType
    _max?: DimensionMaxAggregateInputType
  }

  export type DimensionGroupByOutputType = {
    dimension_id: string
    name: string
    description: string | null
    _count: DimensionCountAggregateOutputType | null
    _min: DimensionMinAggregateOutputType | null
    _max: DimensionMaxAggregateOutputType | null
  }

  type GetDimensionGroupByPayload<T extends DimensionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DimensionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DimensionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DimensionGroupByOutputType[P]>
            : GetScalarType<T[P], DimensionGroupByOutputType[P]>
        }
      >
    >


  export type DimensionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    dimension_id?: boolean
    name?: boolean
    description?: boolean
    archetypes?: boolean | Dimension$archetypesArgs<ExtArgs>
    _count?: boolean | DimensionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dimension"]>

  export type DimensionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    dimension_id?: boolean
    name?: boolean
    description?: boolean
  }, ExtArgs["result"]["dimension"]>

  export type DimensionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    dimension_id?: boolean
    name?: boolean
    description?: boolean
  }, ExtArgs["result"]["dimension"]>

  export type DimensionSelectScalar = {
    dimension_id?: boolean
    name?: boolean
    description?: boolean
  }

  export type DimensionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"dimension_id" | "name" | "description", ExtArgs["result"]["dimension"]>
  export type DimensionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    archetypes?: boolean | Dimension$archetypesArgs<ExtArgs>
    _count?: boolean | DimensionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DimensionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type DimensionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DimensionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Dimension"
    objects: {
      archetypes: Prisma.$ArchetypePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      dimension_id: string
      name: string
      description: string | null
    }, ExtArgs["result"]["dimension"]>
    composites: {}
  }

  type DimensionGetPayload<S extends boolean | null | undefined | DimensionDefaultArgs> = $Result.GetResult<Prisma.$DimensionPayload, S>

  type DimensionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DimensionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DimensionCountAggregateInputType | true
    }

  export interface DimensionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Dimension'], meta: { name: 'Dimension' } }
    /**
     * Find zero or one Dimension that matches the filter.
     * @param {DimensionFindUniqueArgs} args - Arguments to find a Dimension
     * @example
     * // Get one Dimension
     * const dimension = await prisma.dimension.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DimensionFindUniqueArgs>(args: SelectSubset<T, DimensionFindUniqueArgs<ExtArgs>>): Prisma__DimensionClient<$Result.GetResult<Prisma.$DimensionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Dimension that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DimensionFindUniqueOrThrowArgs} args - Arguments to find a Dimension
     * @example
     * // Get one Dimension
     * const dimension = await prisma.dimension.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DimensionFindUniqueOrThrowArgs>(args: SelectSubset<T, DimensionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DimensionClient<$Result.GetResult<Prisma.$DimensionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Dimension that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DimensionFindFirstArgs} args - Arguments to find a Dimension
     * @example
     * // Get one Dimension
     * const dimension = await prisma.dimension.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DimensionFindFirstArgs>(args?: SelectSubset<T, DimensionFindFirstArgs<ExtArgs>>): Prisma__DimensionClient<$Result.GetResult<Prisma.$DimensionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Dimension that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DimensionFindFirstOrThrowArgs} args - Arguments to find a Dimension
     * @example
     * // Get one Dimension
     * const dimension = await prisma.dimension.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DimensionFindFirstOrThrowArgs>(args?: SelectSubset<T, DimensionFindFirstOrThrowArgs<ExtArgs>>): Prisma__DimensionClient<$Result.GetResult<Prisma.$DimensionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Dimensions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DimensionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Dimensions
     * const dimensions = await prisma.dimension.findMany()
     * 
     * // Get first 10 Dimensions
     * const dimensions = await prisma.dimension.findMany({ take: 10 })
     * 
     * // Only select the `dimension_id`
     * const dimensionWithDimension_idOnly = await prisma.dimension.findMany({ select: { dimension_id: true } })
     * 
     */
    findMany<T extends DimensionFindManyArgs>(args?: SelectSubset<T, DimensionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DimensionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Dimension.
     * @param {DimensionCreateArgs} args - Arguments to create a Dimension.
     * @example
     * // Create one Dimension
     * const Dimension = await prisma.dimension.create({
     *   data: {
     *     // ... data to create a Dimension
     *   }
     * })
     * 
     */
    create<T extends DimensionCreateArgs>(args: SelectSubset<T, DimensionCreateArgs<ExtArgs>>): Prisma__DimensionClient<$Result.GetResult<Prisma.$DimensionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Dimensions.
     * @param {DimensionCreateManyArgs} args - Arguments to create many Dimensions.
     * @example
     * // Create many Dimensions
     * const dimension = await prisma.dimension.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DimensionCreateManyArgs>(args?: SelectSubset<T, DimensionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Dimensions and returns the data saved in the database.
     * @param {DimensionCreateManyAndReturnArgs} args - Arguments to create many Dimensions.
     * @example
     * // Create many Dimensions
     * const dimension = await prisma.dimension.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Dimensions and only return the `dimension_id`
     * const dimensionWithDimension_idOnly = await prisma.dimension.createManyAndReturn({
     *   select: { dimension_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DimensionCreateManyAndReturnArgs>(args?: SelectSubset<T, DimensionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DimensionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Dimension.
     * @param {DimensionDeleteArgs} args - Arguments to delete one Dimension.
     * @example
     * // Delete one Dimension
     * const Dimension = await prisma.dimension.delete({
     *   where: {
     *     // ... filter to delete one Dimension
     *   }
     * })
     * 
     */
    delete<T extends DimensionDeleteArgs>(args: SelectSubset<T, DimensionDeleteArgs<ExtArgs>>): Prisma__DimensionClient<$Result.GetResult<Prisma.$DimensionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Dimension.
     * @param {DimensionUpdateArgs} args - Arguments to update one Dimension.
     * @example
     * // Update one Dimension
     * const dimension = await prisma.dimension.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DimensionUpdateArgs>(args: SelectSubset<T, DimensionUpdateArgs<ExtArgs>>): Prisma__DimensionClient<$Result.GetResult<Prisma.$DimensionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Dimensions.
     * @param {DimensionDeleteManyArgs} args - Arguments to filter Dimensions to delete.
     * @example
     * // Delete a few Dimensions
     * const { count } = await prisma.dimension.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DimensionDeleteManyArgs>(args?: SelectSubset<T, DimensionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Dimensions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DimensionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Dimensions
     * const dimension = await prisma.dimension.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DimensionUpdateManyArgs>(args: SelectSubset<T, DimensionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Dimensions and returns the data updated in the database.
     * @param {DimensionUpdateManyAndReturnArgs} args - Arguments to update many Dimensions.
     * @example
     * // Update many Dimensions
     * const dimension = await prisma.dimension.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Dimensions and only return the `dimension_id`
     * const dimensionWithDimension_idOnly = await prisma.dimension.updateManyAndReturn({
     *   select: { dimension_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DimensionUpdateManyAndReturnArgs>(args: SelectSubset<T, DimensionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DimensionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Dimension.
     * @param {DimensionUpsertArgs} args - Arguments to update or create a Dimension.
     * @example
     * // Update or create a Dimension
     * const dimension = await prisma.dimension.upsert({
     *   create: {
     *     // ... data to create a Dimension
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Dimension we want to update
     *   }
     * })
     */
    upsert<T extends DimensionUpsertArgs>(args: SelectSubset<T, DimensionUpsertArgs<ExtArgs>>): Prisma__DimensionClient<$Result.GetResult<Prisma.$DimensionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Dimensions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DimensionCountArgs} args - Arguments to filter Dimensions to count.
     * @example
     * // Count the number of Dimensions
     * const count = await prisma.dimension.count({
     *   where: {
     *     // ... the filter for the Dimensions we want to count
     *   }
     * })
    **/
    count<T extends DimensionCountArgs>(
      args?: Subset<T, DimensionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DimensionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Dimension.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DimensionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DimensionAggregateArgs>(args: Subset<T, DimensionAggregateArgs>): Prisma.PrismaPromise<GetDimensionAggregateType<T>>

    /**
     * Group by Dimension.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DimensionGroupByArgs} args - Group by arguments.
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
      T extends DimensionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DimensionGroupByArgs['orderBy'] }
        : { orderBy?: DimensionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DimensionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDimensionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Dimension model
   */
  readonly fields: DimensionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Dimension.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DimensionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    archetypes<T extends Dimension$archetypesArgs<ExtArgs> = {}>(args?: Subset<T, Dimension$archetypesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArchetypePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Dimension model
   */
  interface DimensionFieldRefs {
    readonly dimension_id: FieldRef<"Dimension", 'String'>
    readonly name: FieldRef<"Dimension", 'String'>
    readonly description: FieldRef<"Dimension", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Dimension findUnique
   */
  export type DimensionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dimension
     */
    select?: DimensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dimension
     */
    omit?: DimensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInclude<ExtArgs> | null
    /**
     * Filter, which Dimension to fetch.
     */
    where: DimensionWhereUniqueInput
  }

  /**
   * Dimension findUniqueOrThrow
   */
  export type DimensionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dimension
     */
    select?: DimensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dimension
     */
    omit?: DimensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInclude<ExtArgs> | null
    /**
     * Filter, which Dimension to fetch.
     */
    where: DimensionWhereUniqueInput
  }

  /**
   * Dimension findFirst
   */
  export type DimensionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dimension
     */
    select?: DimensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dimension
     */
    omit?: DimensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInclude<ExtArgs> | null
    /**
     * Filter, which Dimension to fetch.
     */
    where?: DimensionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dimensions to fetch.
     */
    orderBy?: DimensionOrderByWithRelationInput | DimensionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Dimensions.
     */
    cursor?: DimensionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dimensions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dimensions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Dimensions.
     */
    distinct?: DimensionScalarFieldEnum | DimensionScalarFieldEnum[]
  }

  /**
   * Dimension findFirstOrThrow
   */
  export type DimensionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dimension
     */
    select?: DimensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dimension
     */
    omit?: DimensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInclude<ExtArgs> | null
    /**
     * Filter, which Dimension to fetch.
     */
    where?: DimensionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dimensions to fetch.
     */
    orderBy?: DimensionOrderByWithRelationInput | DimensionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Dimensions.
     */
    cursor?: DimensionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dimensions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dimensions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Dimensions.
     */
    distinct?: DimensionScalarFieldEnum | DimensionScalarFieldEnum[]
  }

  /**
   * Dimension findMany
   */
  export type DimensionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dimension
     */
    select?: DimensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dimension
     */
    omit?: DimensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInclude<ExtArgs> | null
    /**
     * Filter, which Dimensions to fetch.
     */
    where?: DimensionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dimensions to fetch.
     */
    orderBy?: DimensionOrderByWithRelationInput | DimensionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Dimensions.
     */
    cursor?: DimensionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dimensions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dimensions.
     */
    skip?: number
    distinct?: DimensionScalarFieldEnum | DimensionScalarFieldEnum[]
  }

  /**
   * Dimension create
   */
  export type DimensionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dimension
     */
    select?: DimensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dimension
     */
    omit?: DimensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInclude<ExtArgs> | null
    /**
     * The data needed to create a Dimension.
     */
    data: XOR<DimensionCreateInput, DimensionUncheckedCreateInput>
  }

  /**
   * Dimension createMany
   */
  export type DimensionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Dimensions.
     */
    data: DimensionCreateManyInput | DimensionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Dimension createManyAndReturn
   */
  export type DimensionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dimension
     */
    select?: DimensionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Dimension
     */
    omit?: DimensionOmit<ExtArgs> | null
    /**
     * The data used to create many Dimensions.
     */
    data: DimensionCreateManyInput | DimensionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Dimension update
   */
  export type DimensionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dimension
     */
    select?: DimensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dimension
     */
    omit?: DimensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInclude<ExtArgs> | null
    /**
     * The data needed to update a Dimension.
     */
    data: XOR<DimensionUpdateInput, DimensionUncheckedUpdateInput>
    /**
     * Choose, which Dimension to update.
     */
    where: DimensionWhereUniqueInput
  }

  /**
   * Dimension updateMany
   */
  export type DimensionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Dimensions.
     */
    data: XOR<DimensionUpdateManyMutationInput, DimensionUncheckedUpdateManyInput>
    /**
     * Filter which Dimensions to update
     */
    where?: DimensionWhereInput
    /**
     * Limit how many Dimensions to update.
     */
    limit?: number
  }

  /**
   * Dimension updateManyAndReturn
   */
  export type DimensionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dimension
     */
    select?: DimensionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Dimension
     */
    omit?: DimensionOmit<ExtArgs> | null
    /**
     * The data used to update Dimensions.
     */
    data: XOR<DimensionUpdateManyMutationInput, DimensionUncheckedUpdateManyInput>
    /**
     * Filter which Dimensions to update
     */
    where?: DimensionWhereInput
    /**
     * Limit how many Dimensions to update.
     */
    limit?: number
  }

  /**
   * Dimension upsert
   */
  export type DimensionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dimension
     */
    select?: DimensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dimension
     */
    omit?: DimensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInclude<ExtArgs> | null
    /**
     * The filter to search for the Dimension to update in case it exists.
     */
    where: DimensionWhereUniqueInput
    /**
     * In case the Dimension found by the `where` argument doesn't exist, create a new Dimension with this data.
     */
    create: XOR<DimensionCreateInput, DimensionUncheckedCreateInput>
    /**
     * In case the Dimension was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DimensionUpdateInput, DimensionUncheckedUpdateInput>
  }

  /**
   * Dimension delete
   */
  export type DimensionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dimension
     */
    select?: DimensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dimension
     */
    omit?: DimensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInclude<ExtArgs> | null
    /**
     * Filter which Dimension to delete.
     */
    where: DimensionWhereUniqueInput
  }

  /**
   * Dimension deleteMany
   */
  export type DimensionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Dimensions to delete
     */
    where?: DimensionWhereInput
    /**
     * Limit how many Dimensions to delete.
     */
    limit?: number
  }

  /**
   * Dimension.archetypes
   */
  export type Dimension$archetypesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Archetype
     */
    select?: ArchetypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Archetype
     */
    omit?: ArchetypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArchetypeInclude<ExtArgs> | null
    where?: ArchetypeWhereInput
    orderBy?: ArchetypeOrderByWithRelationInput | ArchetypeOrderByWithRelationInput[]
    cursor?: ArchetypeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ArchetypeScalarFieldEnum | ArchetypeScalarFieldEnum[]
  }

  /**
   * Dimension without action
   */
  export type DimensionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dimension
     */
    select?: DimensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dimension
     */
    omit?: DimensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInclude<ExtArgs> | null
  }


  /**
   * Model Archetype
   */

  export type AggregateArchetype = {
    _count: ArchetypeCountAggregateOutputType | null
    _min: ArchetypeMinAggregateOutputType | null
    _max: ArchetypeMaxAggregateOutputType | null
  }

  export type ArchetypeMinAggregateOutputType = {
    archetype_id: string | null
    dimension_id: string | null
    name: string | null
    description: string | null
  }

  export type ArchetypeMaxAggregateOutputType = {
    archetype_id: string | null
    dimension_id: string | null
    name: string | null
    description: string | null
  }

  export type ArchetypeCountAggregateOutputType = {
    archetype_id: number
    dimension_id: number
    name: number
    description: number
    _all: number
  }


  export type ArchetypeMinAggregateInputType = {
    archetype_id?: true
    dimension_id?: true
    name?: true
    description?: true
  }

  export type ArchetypeMaxAggregateInputType = {
    archetype_id?: true
    dimension_id?: true
    name?: true
    description?: true
  }

  export type ArchetypeCountAggregateInputType = {
    archetype_id?: true
    dimension_id?: true
    name?: true
    description?: true
    _all?: true
  }

  export type ArchetypeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Archetype to aggregate.
     */
    where?: ArchetypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Archetypes to fetch.
     */
    orderBy?: ArchetypeOrderByWithRelationInput | ArchetypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ArchetypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Archetypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Archetypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Archetypes
    **/
    _count?: true | ArchetypeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ArchetypeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ArchetypeMaxAggregateInputType
  }

  export type GetArchetypeAggregateType<T extends ArchetypeAggregateArgs> = {
        [P in keyof T & keyof AggregateArchetype]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArchetype[P]>
      : GetScalarType<T[P], AggregateArchetype[P]>
  }




  export type ArchetypeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArchetypeWhereInput
    orderBy?: ArchetypeOrderByWithAggregationInput | ArchetypeOrderByWithAggregationInput[]
    by: ArchetypeScalarFieldEnum[] | ArchetypeScalarFieldEnum
    having?: ArchetypeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ArchetypeCountAggregateInputType | true
    _min?: ArchetypeMinAggregateInputType
    _max?: ArchetypeMaxAggregateInputType
  }

  export type ArchetypeGroupByOutputType = {
    archetype_id: string
    dimension_id: string | null
    name: string
    description: string | null
    _count: ArchetypeCountAggregateOutputType | null
    _min: ArchetypeMinAggregateOutputType | null
    _max: ArchetypeMaxAggregateOutputType | null
  }

  type GetArchetypeGroupByPayload<T extends ArchetypeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ArchetypeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ArchetypeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ArchetypeGroupByOutputType[P]>
            : GetScalarType<T[P], ArchetypeGroupByOutputType[P]>
        }
      >
    >


  export type ArchetypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    archetype_id?: boolean
    dimension_id?: boolean
    name?: boolean
    description?: boolean
    dimension?: boolean | Archetype$dimensionArgs<ExtArgs>
  }, ExtArgs["result"]["archetype"]>

  export type ArchetypeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    archetype_id?: boolean
    dimension_id?: boolean
    name?: boolean
    description?: boolean
    dimension?: boolean | Archetype$dimensionArgs<ExtArgs>
  }, ExtArgs["result"]["archetype"]>

  export type ArchetypeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    archetype_id?: boolean
    dimension_id?: boolean
    name?: boolean
    description?: boolean
    dimension?: boolean | Archetype$dimensionArgs<ExtArgs>
  }, ExtArgs["result"]["archetype"]>

  export type ArchetypeSelectScalar = {
    archetype_id?: boolean
    dimension_id?: boolean
    name?: boolean
    description?: boolean
  }

  export type ArchetypeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"archetype_id" | "dimension_id" | "name" | "description", ExtArgs["result"]["archetype"]>
  export type ArchetypeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dimension?: boolean | Archetype$dimensionArgs<ExtArgs>
  }
  export type ArchetypeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dimension?: boolean | Archetype$dimensionArgs<ExtArgs>
  }
  export type ArchetypeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dimension?: boolean | Archetype$dimensionArgs<ExtArgs>
  }

  export type $ArchetypePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Archetype"
    objects: {
      dimension: Prisma.$DimensionPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      archetype_id: string
      dimension_id: string | null
      name: string
      description: string | null
    }, ExtArgs["result"]["archetype"]>
    composites: {}
  }

  type ArchetypeGetPayload<S extends boolean | null | undefined | ArchetypeDefaultArgs> = $Result.GetResult<Prisma.$ArchetypePayload, S>

  type ArchetypeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ArchetypeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ArchetypeCountAggregateInputType | true
    }

  export interface ArchetypeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Archetype'], meta: { name: 'Archetype' } }
    /**
     * Find zero or one Archetype that matches the filter.
     * @param {ArchetypeFindUniqueArgs} args - Arguments to find a Archetype
     * @example
     * // Get one Archetype
     * const archetype = await prisma.archetype.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ArchetypeFindUniqueArgs>(args: SelectSubset<T, ArchetypeFindUniqueArgs<ExtArgs>>): Prisma__ArchetypeClient<$Result.GetResult<Prisma.$ArchetypePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Archetype that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ArchetypeFindUniqueOrThrowArgs} args - Arguments to find a Archetype
     * @example
     * // Get one Archetype
     * const archetype = await prisma.archetype.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ArchetypeFindUniqueOrThrowArgs>(args: SelectSubset<T, ArchetypeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ArchetypeClient<$Result.GetResult<Prisma.$ArchetypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Archetype that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArchetypeFindFirstArgs} args - Arguments to find a Archetype
     * @example
     * // Get one Archetype
     * const archetype = await prisma.archetype.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ArchetypeFindFirstArgs>(args?: SelectSubset<T, ArchetypeFindFirstArgs<ExtArgs>>): Prisma__ArchetypeClient<$Result.GetResult<Prisma.$ArchetypePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Archetype that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArchetypeFindFirstOrThrowArgs} args - Arguments to find a Archetype
     * @example
     * // Get one Archetype
     * const archetype = await prisma.archetype.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ArchetypeFindFirstOrThrowArgs>(args?: SelectSubset<T, ArchetypeFindFirstOrThrowArgs<ExtArgs>>): Prisma__ArchetypeClient<$Result.GetResult<Prisma.$ArchetypePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Archetypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArchetypeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Archetypes
     * const archetypes = await prisma.archetype.findMany()
     * 
     * // Get first 10 Archetypes
     * const archetypes = await prisma.archetype.findMany({ take: 10 })
     * 
     * // Only select the `archetype_id`
     * const archetypeWithArchetype_idOnly = await prisma.archetype.findMany({ select: { archetype_id: true } })
     * 
     */
    findMany<T extends ArchetypeFindManyArgs>(args?: SelectSubset<T, ArchetypeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArchetypePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Archetype.
     * @param {ArchetypeCreateArgs} args - Arguments to create a Archetype.
     * @example
     * // Create one Archetype
     * const Archetype = await prisma.archetype.create({
     *   data: {
     *     // ... data to create a Archetype
     *   }
     * })
     * 
     */
    create<T extends ArchetypeCreateArgs>(args: SelectSubset<T, ArchetypeCreateArgs<ExtArgs>>): Prisma__ArchetypeClient<$Result.GetResult<Prisma.$ArchetypePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Archetypes.
     * @param {ArchetypeCreateManyArgs} args - Arguments to create many Archetypes.
     * @example
     * // Create many Archetypes
     * const archetype = await prisma.archetype.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ArchetypeCreateManyArgs>(args?: SelectSubset<T, ArchetypeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Archetypes and returns the data saved in the database.
     * @param {ArchetypeCreateManyAndReturnArgs} args - Arguments to create many Archetypes.
     * @example
     * // Create many Archetypes
     * const archetype = await prisma.archetype.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Archetypes and only return the `archetype_id`
     * const archetypeWithArchetype_idOnly = await prisma.archetype.createManyAndReturn({
     *   select: { archetype_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ArchetypeCreateManyAndReturnArgs>(args?: SelectSubset<T, ArchetypeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArchetypePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Archetype.
     * @param {ArchetypeDeleteArgs} args - Arguments to delete one Archetype.
     * @example
     * // Delete one Archetype
     * const Archetype = await prisma.archetype.delete({
     *   where: {
     *     // ... filter to delete one Archetype
     *   }
     * })
     * 
     */
    delete<T extends ArchetypeDeleteArgs>(args: SelectSubset<T, ArchetypeDeleteArgs<ExtArgs>>): Prisma__ArchetypeClient<$Result.GetResult<Prisma.$ArchetypePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Archetype.
     * @param {ArchetypeUpdateArgs} args - Arguments to update one Archetype.
     * @example
     * // Update one Archetype
     * const archetype = await prisma.archetype.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ArchetypeUpdateArgs>(args: SelectSubset<T, ArchetypeUpdateArgs<ExtArgs>>): Prisma__ArchetypeClient<$Result.GetResult<Prisma.$ArchetypePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Archetypes.
     * @param {ArchetypeDeleteManyArgs} args - Arguments to filter Archetypes to delete.
     * @example
     * // Delete a few Archetypes
     * const { count } = await prisma.archetype.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ArchetypeDeleteManyArgs>(args?: SelectSubset<T, ArchetypeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Archetypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArchetypeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Archetypes
     * const archetype = await prisma.archetype.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ArchetypeUpdateManyArgs>(args: SelectSubset<T, ArchetypeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Archetypes and returns the data updated in the database.
     * @param {ArchetypeUpdateManyAndReturnArgs} args - Arguments to update many Archetypes.
     * @example
     * // Update many Archetypes
     * const archetype = await prisma.archetype.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Archetypes and only return the `archetype_id`
     * const archetypeWithArchetype_idOnly = await prisma.archetype.updateManyAndReturn({
     *   select: { archetype_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ArchetypeUpdateManyAndReturnArgs>(args: SelectSubset<T, ArchetypeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArchetypePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Archetype.
     * @param {ArchetypeUpsertArgs} args - Arguments to update or create a Archetype.
     * @example
     * // Update or create a Archetype
     * const archetype = await prisma.archetype.upsert({
     *   create: {
     *     // ... data to create a Archetype
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Archetype we want to update
     *   }
     * })
     */
    upsert<T extends ArchetypeUpsertArgs>(args: SelectSubset<T, ArchetypeUpsertArgs<ExtArgs>>): Prisma__ArchetypeClient<$Result.GetResult<Prisma.$ArchetypePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Archetypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArchetypeCountArgs} args - Arguments to filter Archetypes to count.
     * @example
     * // Count the number of Archetypes
     * const count = await prisma.archetype.count({
     *   where: {
     *     // ... the filter for the Archetypes we want to count
     *   }
     * })
    **/
    count<T extends ArchetypeCountArgs>(
      args?: Subset<T, ArchetypeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ArchetypeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Archetype.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArchetypeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ArchetypeAggregateArgs>(args: Subset<T, ArchetypeAggregateArgs>): Prisma.PrismaPromise<GetArchetypeAggregateType<T>>

    /**
     * Group by Archetype.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArchetypeGroupByArgs} args - Group by arguments.
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
      T extends ArchetypeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ArchetypeGroupByArgs['orderBy'] }
        : { orderBy?: ArchetypeGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ArchetypeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArchetypeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Archetype model
   */
  readonly fields: ArchetypeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Archetype.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ArchetypeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dimension<T extends Archetype$dimensionArgs<ExtArgs> = {}>(args?: Subset<T, Archetype$dimensionArgs<ExtArgs>>): Prisma__DimensionClient<$Result.GetResult<Prisma.$DimensionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Archetype model
   */
  interface ArchetypeFieldRefs {
    readonly archetype_id: FieldRef<"Archetype", 'String'>
    readonly dimension_id: FieldRef<"Archetype", 'String'>
    readonly name: FieldRef<"Archetype", 'String'>
    readonly description: FieldRef<"Archetype", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Archetype findUnique
   */
  export type ArchetypeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Archetype
     */
    select?: ArchetypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Archetype
     */
    omit?: ArchetypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArchetypeInclude<ExtArgs> | null
    /**
     * Filter, which Archetype to fetch.
     */
    where: ArchetypeWhereUniqueInput
  }

  /**
   * Archetype findUniqueOrThrow
   */
  export type ArchetypeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Archetype
     */
    select?: ArchetypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Archetype
     */
    omit?: ArchetypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArchetypeInclude<ExtArgs> | null
    /**
     * Filter, which Archetype to fetch.
     */
    where: ArchetypeWhereUniqueInput
  }

  /**
   * Archetype findFirst
   */
  export type ArchetypeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Archetype
     */
    select?: ArchetypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Archetype
     */
    omit?: ArchetypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArchetypeInclude<ExtArgs> | null
    /**
     * Filter, which Archetype to fetch.
     */
    where?: ArchetypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Archetypes to fetch.
     */
    orderBy?: ArchetypeOrderByWithRelationInput | ArchetypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Archetypes.
     */
    cursor?: ArchetypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Archetypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Archetypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Archetypes.
     */
    distinct?: ArchetypeScalarFieldEnum | ArchetypeScalarFieldEnum[]
  }

  /**
   * Archetype findFirstOrThrow
   */
  export type ArchetypeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Archetype
     */
    select?: ArchetypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Archetype
     */
    omit?: ArchetypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArchetypeInclude<ExtArgs> | null
    /**
     * Filter, which Archetype to fetch.
     */
    where?: ArchetypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Archetypes to fetch.
     */
    orderBy?: ArchetypeOrderByWithRelationInput | ArchetypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Archetypes.
     */
    cursor?: ArchetypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Archetypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Archetypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Archetypes.
     */
    distinct?: ArchetypeScalarFieldEnum | ArchetypeScalarFieldEnum[]
  }

  /**
   * Archetype findMany
   */
  export type ArchetypeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Archetype
     */
    select?: ArchetypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Archetype
     */
    omit?: ArchetypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArchetypeInclude<ExtArgs> | null
    /**
     * Filter, which Archetypes to fetch.
     */
    where?: ArchetypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Archetypes to fetch.
     */
    orderBy?: ArchetypeOrderByWithRelationInput | ArchetypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Archetypes.
     */
    cursor?: ArchetypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Archetypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Archetypes.
     */
    skip?: number
    distinct?: ArchetypeScalarFieldEnum | ArchetypeScalarFieldEnum[]
  }

  /**
   * Archetype create
   */
  export type ArchetypeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Archetype
     */
    select?: ArchetypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Archetype
     */
    omit?: ArchetypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArchetypeInclude<ExtArgs> | null
    /**
     * The data needed to create a Archetype.
     */
    data: XOR<ArchetypeCreateInput, ArchetypeUncheckedCreateInput>
  }

  /**
   * Archetype createMany
   */
  export type ArchetypeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Archetypes.
     */
    data: ArchetypeCreateManyInput | ArchetypeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Archetype createManyAndReturn
   */
  export type ArchetypeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Archetype
     */
    select?: ArchetypeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Archetype
     */
    omit?: ArchetypeOmit<ExtArgs> | null
    /**
     * The data used to create many Archetypes.
     */
    data: ArchetypeCreateManyInput | ArchetypeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArchetypeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Archetype update
   */
  export type ArchetypeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Archetype
     */
    select?: ArchetypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Archetype
     */
    omit?: ArchetypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArchetypeInclude<ExtArgs> | null
    /**
     * The data needed to update a Archetype.
     */
    data: XOR<ArchetypeUpdateInput, ArchetypeUncheckedUpdateInput>
    /**
     * Choose, which Archetype to update.
     */
    where: ArchetypeWhereUniqueInput
  }

  /**
   * Archetype updateMany
   */
  export type ArchetypeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Archetypes.
     */
    data: XOR<ArchetypeUpdateManyMutationInput, ArchetypeUncheckedUpdateManyInput>
    /**
     * Filter which Archetypes to update
     */
    where?: ArchetypeWhereInput
    /**
     * Limit how many Archetypes to update.
     */
    limit?: number
  }

  /**
   * Archetype updateManyAndReturn
   */
  export type ArchetypeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Archetype
     */
    select?: ArchetypeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Archetype
     */
    omit?: ArchetypeOmit<ExtArgs> | null
    /**
     * The data used to update Archetypes.
     */
    data: XOR<ArchetypeUpdateManyMutationInput, ArchetypeUncheckedUpdateManyInput>
    /**
     * Filter which Archetypes to update
     */
    where?: ArchetypeWhereInput
    /**
     * Limit how many Archetypes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArchetypeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Archetype upsert
   */
  export type ArchetypeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Archetype
     */
    select?: ArchetypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Archetype
     */
    omit?: ArchetypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArchetypeInclude<ExtArgs> | null
    /**
     * The filter to search for the Archetype to update in case it exists.
     */
    where: ArchetypeWhereUniqueInput
    /**
     * In case the Archetype found by the `where` argument doesn't exist, create a new Archetype with this data.
     */
    create: XOR<ArchetypeCreateInput, ArchetypeUncheckedCreateInput>
    /**
     * In case the Archetype was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ArchetypeUpdateInput, ArchetypeUncheckedUpdateInput>
  }

  /**
   * Archetype delete
   */
  export type ArchetypeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Archetype
     */
    select?: ArchetypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Archetype
     */
    omit?: ArchetypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArchetypeInclude<ExtArgs> | null
    /**
     * Filter which Archetype to delete.
     */
    where: ArchetypeWhereUniqueInput
  }

  /**
   * Archetype deleteMany
   */
  export type ArchetypeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Archetypes to delete
     */
    where?: ArchetypeWhereInput
    /**
     * Limit how many Archetypes to delete.
     */
    limit?: number
  }

  /**
   * Archetype.dimension
   */
  export type Archetype$dimensionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dimension
     */
    select?: DimensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dimension
     */
    omit?: DimensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInclude<ExtArgs> | null
    where?: DimensionWhereInput
  }

  /**
   * Archetype without action
   */
  export type ArchetypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Archetype
     */
    select?: ArchetypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Archetype
     */
    omit?: ArchetypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArchetypeInclude<ExtArgs> | null
  }


  /**
   * Model Content
   */

  export type AggregateContent = {
    _count: ContentCountAggregateOutputType | null
    _min: ContentMinAggregateOutputType | null
    _max: ContentMaxAggregateOutputType | null
  }

  export type ContentMinAggregateOutputType = {
    content_id: string | null
    title: string | null
    description: string | null
    prerequisite_id: string | null
    created_at: Date | null
  }

  export type ContentMaxAggregateOutputType = {
    content_id: string | null
    title: string | null
    description: string | null
    prerequisite_id: string | null
    created_at: Date | null
  }

  export type ContentCountAggregateOutputType = {
    content_id: number
    title: number
    description: number
    prerequisite_id: number
    created_at: number
    _all: number
  }


  export type ContentMinAggregateInputType = {
    content_id?: true
    title?: true
    description?: true
    prerequisite_id?: true
    created_at?: true
  }

  export type ContentMaxAggregateInputType = {
    content_id?: true
    title?: true
    description?: true
    prerequisite_id?: true
    created_at?: true
  }

  export type ContentCountAggregateInputType = {
    content_id?: true
    title?: true
    description?: true
    prerequisite_id?: true
    created_at?: true
    _all?: true
  }

  export type ContentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Content to aggregate.
     */
    where?: ContentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Contents to fetch.
     */
    orderBy?: ContentOrderByWithRelationInput | ContentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ContentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Contents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Contents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Contents
    **/
    _count?: true | ContentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ContentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ContentMaxAggregateInputType
  }

  export type GetContentAggregateType<T extends ContentAggregateArgs> = {
        [P in keyof T & keyof AggregateContent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateContent[P]>
      : GetScalarType<T[P], AggregateContent[P]>
  }




  export type ContentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContentWhereInput
    orderBy?: ContentOrderByWithAggregationInput | ContentOrderByWithAggregationInput[]
    by: ContentScalarFieldEnum[] | ContentScalarFieldEnum
    having?: ContentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ContentCountAggregateInputType | true
    _min?: ContentMinAggregateInputType
    _max?: ContentMaxAggregateInputType
  }

  export type ContentGroupByOutputType = {
    content_id: string
    title: string
    description: string | null
    prerequisite_id: string | null
    created_at: Date
    _count: ContentCountAggregateOutputType | null
    _min: ContentMinAggregateOutputType | null
    _max: ContentMaxAggregateOutputType | null
  }

  type GetContentGroupByPayload<T extends ContentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ContentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ContentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ContentGroupByOutputType[P]>
            : GetScalarType<T[P], ContentGroupByOutputType[P]>
        }
      >
    >


  export type ContentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    content_id?: boolean
    title?: boolean
    description?: boolean
    prerequisite_id?: boolean
    created_at?: boolean
    prerequisite?: boolean | Content$prerequisiteArgs<ExtArgs>
    prerequisites?: boolean | Content$prerequisitesArgs<ExtArgs>
    userProgress?: boolean | Content$userProgressArgs<ExtArgs>
    _count?: boolean | ContentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["content"]>

  export type ContentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    content_id?: boolean
    title?: boolean
    description?: boolean
    prerequisite_id?: boolean
    created_at?: boolean
    prerequisite?: boolean | Content$prerequisiteArgs<ExtArgs>
  }, ExtArgs["result"]["content"]>

  export type ContentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    content_id?: boolean
    title?: boolean
    description?: boolean
    prerequisite_id?: boolean
    created_at?: boolean
    prerequisite?: boolean | Content$prerequisiteArgs<ExtArgs>
  }, ExtArgs["result"]["content"]>

  export type ContentSelectScalar = {
    content_id?: boolean
    title?: boolean
    description?: boolean
    prerequisite_id?: boolean
    created_at?: boolean
  }

  export type ContentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"content_id" | "title" | "description" | "prerequisite_id" | "created_at", ExtArgs["result"]["content"]>
  export type ContentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    prerequisite?: boolean | Content$prerequisiteArgs<ExtArgs>
    prerequisites?: boolean | Content$prerequisitesArgs<ExtArgs>
    userProgress?: boolean | Content$userProgressArgs<ExtArgs>
    _count?: boolean | ContentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ContentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    prerequisite?: boolean | Content$prerequisiteArgs<ExtArgs>
  }
  export type ContentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    prerequisite?: boolean | Content$prerequisiteArgs<ExtArgs>
  }

  export type $ContentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Content"
    objects: {
      prerequisite: Prisma.$ContentPayload<ExtArgs> | null
      prerequisites: Prisma.$ContentPayload<ExtArgs>[]
      userProgress: Prisma.$UserContentProgressPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      content_id: string
      title: string
      description: string | null
      prerequisite_id: string | null
      created_at: Date
    }, ExtArgs["result"]["content"]>
    composites: {}
  }

  type ContentGetPayload<S extends boolean | null | undefined | ContentDefaultArgs> = $Result.GetResult<Prisma.$ContentPayload, S>

  type ContentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ContentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ContentCountAggregateInputType | true
    }

  export interface ContentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Content'], meta: { name: 'Content' } }
    /**
     * Find zero or one Content that matches the filter.
     * @param {ContentFindUniqueArgs} args - Arguments to find a Content
     * @example
     * // Get one Content
     * const content = await prisma.content.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ContentFindUniqueArgs>(args: SelectSubset<T, ContentFindUniqueArgs<ExtArgs>>): Prisma__ContentClient<$Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Content that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ContentFindUniqueOrThrowArgs} args - Arguments to find a Content
     * @example
     * // Get one Content
     * const content = await prisma.content.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ContentFindUniqueOrThrowArgs>(args: SelectSubset<T, ContentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ContentClient<$Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Content that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentFindFirstArgs} args - Arguments to find a Content
     * @example
     * // Get one Content
     * const content = await prisma.content.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ContentFindFirstArgs>(args?: SelectSubset<T, ContentFindFirstArgs<ExtArgs>>): Prisma__ContentClient<$Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Content that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentFindFirstOrThrowArgs} args - Arguments to find a Content
     * @example
     * // Get one Content
     * const content = await prisma.content.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ContentFindFirstOrThrowArgs>(args?: SelectSubset<T, ContentFindFirstOrThrowArgs<ExtArgs>>): Prisma__ContentClient<$Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Contents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Contents
     * const contents = await prisma.content.findMany()
     * 
     * // Get first 10 Contents
     * const contents = await prisma.content.findMany({ take: 10 })
     * 
     * // Only select the `content_id`
     * const contentWithContent_idOnly = await prisma.content.findMany({ select: { content_id: true } })
     * 
     */
    findMany<T extends ContentFindManyArgs>(args?: SelectSubset<T, ContentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Content.
     * @param {ContentCreateArgs} args - Arguments to create a Content.
     * @example
     * // Create one Content
     * const Content = await prisma.content.create({
     *   data: {
     *     // ... data to create a Content
     *   }
     * })
     * 
     */
    create<T extends ContentCreateArgs>(args: SelectSubset<T, ContentCreateArgs<ExtArgs>>): Prisma__ContentClient<$Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Contents.
     * @param {ContentCreateManyArgs} args - Arguments to create many Contents.
     * @example
     * // Create many Contents
     * const content = await prisma.content.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ContentCreateManyArgs>(args?: SelectSubset<T, ContentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Contents and returns the data saved in the database.
     * @param {ContentCreateManyAndReturnArgs} args - Arguments to create many Contents.
     * @example
     * // Create many Contents
     * const content = await prisma.content.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Contents and only return the `content_id`
     * const contentWithContent_idOnly = await prisma.content.createManyAndReturn({
     *   select: { content_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ContentCreateManyAndReturnArgs>(args?: SelectSubset<T, ContentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Content.
     * @param {ContentDeleteArgs} args - Arguments to delete one Content.
     * @example
     * // Delete one Content
     * const Content = await prisma.content.delete({
     *   where: {
     *     // ... filter to delete one Content
     *   }
     * })
     * 
     */
    delete<T extends ContentDeleteArgs>(args: SelectSubset<T, ContentDeleteArgs<ExtArgs>>): Prisma__ContentClient<$Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Content.
     * @param {ContentUpdateArgs} args - Arguments to update one Content.
     * @example
     * // Update one Content
     * const content = await prisma.content.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ContentUpdateArgs>(args: SelectSubset<T, ContentUpdateArgs<ExtArgs>>): Prisma__ContentClient<$Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Contents.
     * @param {ContentDeleteManyArgs} args - Arguments to filter Contents to delete.
     * @example
     * // Delete a few Contents
     * const { count } = await prisma.content.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ContentDeleteManyArgs>(args?: SelectSubset<T, ContentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Contents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Contents
     * const content = await prisma.content.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ContentUpdateManyArgs>(args: SelectSubset<T, ContentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Contents and returns the data updated in the database.
     * @param {ContentUpdateManyAndReturnArgs} args - Arguments to update many Contents.
     * @example
     * // Update many Contents
     * const content = await prisma.content.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Contents and only return the `content_id`
     * const contentWithContent_idOnly = await prisma.content.updateManyAndReturn({
     *   select: { content_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ContentUpdateManyAndReturnArgs>(args: SelectSubset<T, ContentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Content.
     * @param {ContentUpsertArgs} args - Arguments to update or create a Content.
     * @example
     * // Update or create a Content
     * const content = await prisma.content.upsert({
     *   create: {
     *     // ... data to create a Content
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Content we want to update
     *   }
     * })
     */
    upsert<T extends ContentUpsertArgs>(args: SelectSubset<T, ContentUpsertArgs<ExtArgs>>): Prisma__ContentClient<$Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Contents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentCountArgs} args - Arguments to filter Contents to count.
     * @example
     * // Count the number of Contents
     * const count = await prisma.content.count({
     *   where: {
     *     // ... the filter for the Contents we want to count
     *   }
     * })
    **/
    count<T extends ContentCountArgs>(
      args?: Subset<T, ContentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ContentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Content.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ContentAggregateArgs>(args: Subset<T, ContentAggregateArgs>): Prisma.PrismaPromise<GetContentAggregateType<T>>

    /**
     * Group by Content.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentGroupByArgs} args - Group by arguments.
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
      T extends ContentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ContentGroupByArgs['orderBy'] }
        : { orderBy?: ContentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ContentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Content model
   */
  readonly fields: ContentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Content.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ContentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    prerequisite<T extends Content$prerequisiteArgs<ExtArgs> = {}>(args?: Subset<T, Content$prerequisiteArgs<ExtArgs>>): Prisma__ContentClient<$Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    prerequisites<T extends Content$prerequisitesArgs<ExtArgs> = {}>(args?: Subset<T, Content$prerequisitesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    userProgress<T extends Content$userProgressArgs<ExtArgs> = {}>(args?: Subset<T, Content$userProgressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserContentProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Content model
   */
  interface ContentFieldRefs {
    readonly content_id: FieldRef<"Content", 'String'>
    readonly title: FieldRef<"Content", 'String'>
    readonly description: FieldRef<"Content", 'String'>
    readonly prerequisite_id: FieldRef<"Content", 'String'>
    readonly created_at: FieldRef<"Content", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Content findUnique
   */
  export type ContentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Content
     */
    select?: ContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Content
     */
    omit?: ContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentInclude<ExtArgs> | null
    /**
     * Filter, which Content to fetch.
     */
    where: ContentWhereUniqueInput
  }

  /**
   * Content findUniqueOrThrow
   */
  export type ContentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Content
     */
    select?: ContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Content
     */
    omit?: ContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentInclude<ExtArgs> | null
    /**
     * Filter, which Content to fetch.
     */
    where: ContentWhereUniqueInput
  }

  /**
   * Content findFirst
   */
  export type ContentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Content
     */
    select?: ContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Content
     */
    omit?: ContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentInclude<ExtArgs> | null
    /**
     * Filter, which Content to fetch.
     */
    where?: ContentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Contents to fetch.
     */
    orderBy?: ContentOrderByWithRelationInput | ContentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Contents.
     */
    cursor?: ContentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Contents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Contents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Contents.
     */
    distinct?: ContentScalarFieldEnum | ContentScalarFieldEnum[]
  }

  /**
   * Content findFirstOrThrow
   */
  export type ContentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Content
     */
    select?: ContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Content
     */
    omit?: ContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentInclude<ExtArgs> | null
    /**
     * Filter, which Content to fetch.
     */
    where?: ContentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Contents to fetch.
     */
    orderBy?: ContentOrderByWithRelationInput | ContentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Contents.
     */
    cursor?: ContentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Contents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Contents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Contents.
     */
    distinct?: ContentScalarFieldEnum | ContentScalarFieldEnum[]
  }

  /**
   * Content findMany
   */
  export type ContentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Content
     */
    select?: ContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Content
     */
    omit?: ContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentInclude<ExtArgs> | null
    /**
     * Filter, which Contents to fetch.
     */
    where?: ContentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Contents to fetch.
     */
    orderBy?: ContentOrderByWithRelationInput | ContentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Contents.
     */
    cursor?: ContentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Contents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Contents.
     */
    skip?: number
    distinct?: ContentScalarFieldEnum | ContentScalarFieldEnum[]
  }

  /**
   * Content create
   */
  export type ContentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Content
     */
    select?: ContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Content
     */
    omit?: ContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentInclude<ExtArgs> | null
    /**
     * The data needed to create a Content.
     */
    data: XOR<ContentCreateInput, ContentUncheckedCreateInput>
  }

  /**
   * Content createMany
   */
  export type ContentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Contents.
     */
    data: ContentCreateManyInput | ContentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Content createManyAndReturn
   */
  export type ContentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Content
     */
    select?: ContentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Content
     */
    omit?: ContentOmit<ExtArgs> | null
    /**
     * The data used to create many Contents.
     */
    data: ContentCreateManyInput | ContentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Content update
   */
  export type ContentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Content
     */
    select?: ContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Content
     */
    omit?: ContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentInclude<ExtArgs> | null
    /**
     * The data needed to update a Content.
     */
    data: XOR<ContentUpdateInput, ContentUncheckedUpdateInput>
    /**
     * Choose, which Content to update.
     */
    where: ContentWhereUniqueInput
  }

  /**
   * Content updateMany
   */
  export type ContentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Contents.
     */
    data: XOR<ContentUpdateManyMutationInput, ContentUncheckedUpdateManyInput>
    /**
     * Filter which Contents to update
     */
    where?: ContentWhereInput
    /**
     * Limit how many Contents to update.
     */
    limit?: number
  }

  /**
   * Content updateManyAndReturn
   */
  export type ContentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Content
     */
    select?: ContentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Content
     */
    omit?: ContentOmit<ExtArgs> | null
    /**
     * The data used to update Contents.
     */
    data: XOR<ContentUpdateManyMutationInput, ContentUncheckedUpdateManyInput>
    /**
     * Filter which Contents to update
     */
    where?: ContentWhereInput
    /**
     * Limit how many Contents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Content upsert
   */
  export type ContentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Content
     */
    select?: ContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Content
     */
    omit?: ContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentInclude<ExtArgs> | null
    /**
     * The filter to search for the Content to update in case it exists.
     */
    where: ContentWhereUniqueInput
    /**
     * In case the Content found by the `where` argument doesn't exist, create a new Content with this data.
     */
    create: XOR<ContentCreateInput, ContentUncheckedCreateInput>
    /**
     * In case the Content was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ContentUpdateInput, ContentUncheckedUpdateInput>
  }

  /**
   * Content delete
   */
  export type ContentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Content
     */
    select?: ContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Content
     */
    omit?: ContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentInclude<ExtArgs> | null
    /**
     * Filter which Content to delete.
     */
    where: ContentWhereUniqueInput
  }

  /**
   * Content deleteMany
   */
  export type ContentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Contents to delete
     */
    where?: ContentWhereInput
    /**
     * Limit how many Contents to delete.
     */
    limit?: number
  }

  /**
   * Content.prerequisite
   */
  export type Content$prerequisiteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Content
     */
    select?: ContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Content
     */
    omit?: ContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentInclude<ExtArgs> | null
    where?: ContentWhereInput
  }

  /**
   * Content.prerequisites
   */
  export type Content$prerequisitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Content
     */
    select?: ContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Content
     */
    omit?: ContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentInclude<ExtArgs> | null
    where?: ContentWhereInput
    orderBy?: ContentOrderByWithRelationInput | ContentOrderByWithRelationInput[]
    cursor?: ContentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ContentScalarFieldEnum | ContentScalarFieldEnum[]
  }

  /**
   * Content.userProgress
   */
  export type Content$userProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserContentProgress
     */
    select?: UserContentProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserContentProgress
     */
    omit?: UserContentProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserContentProgressInclude<ExtArgs> | null
    where?: UserContentProgressWhereInput
    orderBy?: UserContentProgressOrderByWithRelationInput | UserContentProgressOrderByWithRelationInput[]
    cursor?: UserContentProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserContentProgressScalarFieldEnum | UserContentProgressScalarFieldEnum[]
  }

  /**
   * Content without action
   */
  export type ContentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Content
     */
    select?: ContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Content
     */
    omit?: ContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentInclude<ExtArgs> | null
  }


  /**
   * Model UserContentProgress
   */

  export type AggregateUserContentProgress = {
    _count: UserContentProgressCountAggregateOutputType | null
    _avg: UserContentProgressAvgAggregateOutputType | null
    _sum: UserContentProgressSumAggregateOutputType | null
    _min: UserContentProgressMinAggregateOutputType | null
    _max: UserContentProgressMaxAggregateOutputType | null
  }

  export type UserContentProgressAvgAggregateOutputType = {
    progress: number | null
  }

  export type UserContentProgressSumAggregateOutputType = {
    progress: number | null
  }

  export type UserContentProgressMinAggregateOutputType = {
    user_id: string | null
    content_id: string | null
    completed: boolean | null
    progress: number | null
    last_update: Date | null
  }

  export type UserContentProgressMaxAggregateOutputType = {
    user_id: string | null
    content_id: string | null
    completed: boolean | null
    progress: number | null
    last_update: Date | null
  }

  export type UserContentProgressCountAggregateOutputType = {
    user_id: number
    content_id: number
    completed: number
    progress: number
    last_update: number
    _all: number
  }


  export type UserContentProgressAvgAggregateInputType = {
    progress?: true
  }

  export type UserContentProgressSumAggregateInputType = {
    progress?: true
  }

  export type UserContentProgressMinAggregateInputType = {
    user_id?: true
    content_id?: true
    completed?: true
    progress?: true
    last_update?: true
  }

  export type UserContentProgressMaxAggregateInputType = {
    user_id?: true
    content_id?: true
    completed?: true
    progress?: true
    last_update?: true
  }

  export type UserContentProgressCountAggregateInputType = {
    user_id?: true
    content_id?: true
    completed?: true
    progress?: true
    last_update?: true
    _all?: true
  }

  export type UserContentProgressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserContentProgress to aggregate.
     */
    where?: UserContentProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserContentProgresses to fetch.
     */
    orderBy?: UserContentProgressOrderByWithRelationInput | UserContentProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserContentProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserContentProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserContentProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserContentProgresses
    **/
    _count?: true | UserContentProgressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserContentProgressAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserContentProgressSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserContentProgressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserContentProgressMaxAggregateInputType
  }

  export type GetUserContentProgressAggregateType<T extends UserContentProgressAggregateArgs> = {
        [P in keyof T & keyof AggregateUserContentProgress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserContentProgress[P]>
      : GetScalarType<T[P], AggregateUserContentProgress[P]>
  }




  export type UserContentProgressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserContentProgressWhereInput
    orderBy?: UserContentProgressOrderByWithAggregationInput | UserContentProgressOrderByWithAggregationInput[]
    by: UserContentProgressScalarFieldEnum[] | UserContentProgressScalarFieldEnum
    having?: UserContentProgressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserContentProgressCountAggregateInputType | true
    _avg?: UserContentProgressAvgAggregateInputType
    _sum?: UserContentProgressSumAggregateInputType
    _min?: UserContentProgressMinAggregateInputType
    _max?: UserContentProgressMaxAggregateInputType
  }

  export type UserContentProgressGroupByOutputType = {
    user_id: string
    content_id: string
    completed: boolean
    progress: number | null
    last_update: Date
    _count: UserContentProgressCountAggregateOutputType | null
    _avg: UserContentProgressAvgAggregateOutputType | null
    _sum: UserContentProgressSumAggregateOutputType | null
    _min: UserContentProgressMinAggregateOutputType | null
    _max: UserContentProgressMaxAggregateOutputType | null
  }

  type GetUserContentProgressGroupByPayload<T extends UserContentProgressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserContentProgressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserContentProgressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserContentProgressGroupByOutputType[P]>
            : GetScalarType<T[P], UserContentProgressGroupByOutputType[P]>
        }
      >
    >


  export type UserContentProgressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    content_id?: boolean
    completed?: boolean
    progress?: boolean
    last_update?: boolean
    content?: boolean | ContentDefaultArgs<ExtArgs>
    user?: boolean | app_userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userContentProgress"]>

  export type UserContentProgressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    content_id?: boolean
    completed?: boolean
    progress?: boolean
    last_update?: boolean
    content?: boolean | ContentDefaultArgs<ExtArgs>
    user?: boolean | app_userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userContentProgress"]>

  export type UserContentProgressSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    content_id?: boolean
    completed?: boolean
    progress?: boolean
    last_update?: boolean
    content?: boolean | ContentDefaultArgs<ExtArgs>
    user?: boolean | app_userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userContentProgress"]>

  export type UserContentProgressSelectScalar = {
    user_id?: boolean
    content_id?: boolean
    completed?: boolean
    progress?: boolean
    last_update?: boolean
  }

  export type UserContentProgressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"user_id" | "content_id" | "completed" | "progress" | "last_update", ExtArgs["result"]["userContentProgress"]>
  export type UserContentProgressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    content?: boolean | ContentDefaultArgs<ExtArgs>
    user?: boolean | app_userDefaultArgs<ExtArgs>
  }
  export type UserContentProgressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    content?: boolean | ContentDefaultArgs<ExtArgs>
    user?: boolean | app_userDefaultArgs<ExtArgs>
  }
  export type UserContentProgressIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    content?: boolean | ContentDefaultArgs<ExtArgs>
    user?: boolean | app_userDefaultArgs<ExtArgs>
  }

  export type $UserContentProgressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserContentProgress"
    objects: {
      content: Prisma.$ContentPayload<ExtArgs>
      user: Prisma.$app_userPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      user_id: string
      content_id: string
      completed: boolean
      progress: number | null
      last_update: Date
    }, ExtArgs["result"]["userContentProgress"]>
    composites: {}
  }

  type UserContentProgressGetPayload<S extends boolean | null | undefined | UserContentProgressDefaultArgs> = $Result.GetResult<Prisma.$UserContentProgressPayload, S>

  type UserContentProgressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserContentProgressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserContentProgressCountAggregateInputType | true
    }

  export interface UserContentProgressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserContentProgress'], meta: { name: 'UserContentProgress' } }
    /**
     * Find zero or one UserContentProgress that matches the filter.
     * @param {UserContentProgressFindUniqueArgs} args - Arguments to find a UserContentProgress
     * @example
     * // Get one UserContentProgress
     * const userContentProgress = await prisma.userContentProgress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserContentProgressFindUniqueArgs>(args: SelectSubset<T, UserContentProgressFindUniqueArgs<ExtArgs>>): Prisma__UserContentProgressClient<$Result.GetResult<Prisma.$UserContentProgressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserContentProgress that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserContentProgressFindUniqueOrThrowArgs} args - Arguments to find a UserContentProgress
     * @example
     * // Get one UserContentProgress
     * const userContentProgress = await prisma.userContentProgress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserContentProgressFindUniqueOrThrowArgs>(args: SelectSubset<T, UserContentProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserContentProgressClient<$Result.GetResult<Prisma.$UserContentProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserContentProgress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserContentProgressFindFirstArgs} args - Arguments to find a UserContentProgress
     * @example
     * // Get one UserContentProgress
     * const userContentProgress = await prisma.userContentProgress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserContentProgressFindFirstArgs>(args?: SelectSubset<T, UserContentProgressFindFirstArgs<ExtArgs>>): Prisma__UserContentProgressClient<$Result.GetResult<Prisma.$UserContentProgressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserContentProgress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserContentProgressFindFirstOrThrowArgs} args - Arguments to find a UserContentProgress
     * @example
     * // Get one UserContentProgress
     * const userContentProgress = await prisma.userContentProgress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserContentProgressFindFirstOrThrowArgs>(args?: SelectSubset<T, UserContentProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserContentProgressClient<$Result.GetResult<Prisma.$UserContentProgressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserContentProgresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserContentProgressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserContentProgresses
     * const userContentProgresses = await prisma.userContentProgress.findMany()
     * 
     * // Get first 10 UserContentProgresses
     * const userContentProgresses = await prisma.userContentProgress.findMany({ take: 10 })
     * 
     * // Only select the `user_id`
     * const userContentProgressWithUser_idOnly = await prisma.userContentProgress.findMany({ select: { user_id: true } })
     * 
     */
    findMany<T extends UserContentProgressFindManyArgs>(args?: SelectSubset<T, UserContentProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserContentProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserContentProgress.
     * @param {UserContentProgressCreateArgs} args - Arguments to create a UserContentProgress.
     * @example
     * // Create one UserContentProgress
     * const UserContentProgress = await prisma.userContentProgress.create({
     *   data: {
     *     // ... data to create a UserContentProgress
     *   }
     * })
     * 
     */
    create<T extends UserContentProgressCreateArgs>(args: SelectSubset<T, UserContentProgressCreateArgs<ExtArgs>>): Prisma__UserContentProgressClient<$Result.GetResult<Prisma.$UserContentProgressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserContentProgresses.
     * @param {UserContentProgressCreateManyArgs} args - Arguments to create many UserContentProgresses.
     * @example
     * // Create many UserContentProgresses
     * const userContentProgress = await prisma.userContentProgress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserContentProgressCreateManyArgs>(args?: SelectSubset<T, UserContentProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserContentProgresses and returns the data saved in the database.
     * @param {UserContentProgressCreateManyAndReturnArgs} args - Arguments to create many UserContentProgresses.
     * @example
     * // Create many UserContentProgresses
     * const userContentProgress = await prisma.userContentProgress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserContentProgresses and only return the `user_id`
     * const userContentProgressWithUser_idOnly = await prisma.userContentProgress.createManyAndReturn({
     *   select: { user_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserContentProgressCreateManyAndReturnArgs>(args?: SelectSubset<T, UserContentProgressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserContentProgressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserContentProgress.
     * @param {UserContentProgressDeleteArgs} args - Arguments to delete one UserContentProgress.
     * @example
     * // Delete one UserContentProgress
     * const UserContentProgress = await prisma.userContentProgress.delete({
     *   where: {
     *     // ... filter to delete one UserContentProgress
     *   }
     * })
     * 
     */
    delete<T extends UserContentProgressDeleteArgs>(args: SelectSubset<T, UserContentProgressDeleteArgs<ExtArgs>>): Prisma__UserContentProgressClient<$Result.GetResult<Prisma.$UserContentProgressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserContentProgress.
     * @param {UserContentProgressUpdateArgs} args - Arguments to update one UserContentProgress.
     * @example
     * // Update one UserContentProgress
     * const userContentProgress = await prisma.userContentProgress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserContentProgressUpdateArgs>(args: SelectSubset<T, UserContentProgressUpdateArgs<ExtArgs>>): Prisma__UserContentProgressClient<$Result.GetResult<Prisma.$UserContentProgressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserContentProgresses.
     * @param {UserContentProgressDeleteManyArgs} args - Arguments to filter UserContentProgresses to delete.
     * @example
     * // Delete a few UserContentProgresses
     * const { count } = await prisma.userContentProgress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserContentProgressDeleteManyArgs>(args?: SelectSubset<T, UserContentProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserContentProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserContentProgressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserContentProgresses
     * const userContentProgress = await prisma.userContentProgress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserContentProgressUpdateManyArgs>(args: SelectSubset<T, UserContentProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserContentProgresses and returns the data updated in the database.
     * @param {UserContentProgressUpdateManyAndReturnArgs} args - Arguments to update many UserContentProgresses.
     * @example
     * // Update many UserContentProgresses
     * const userContentProgress = await prisma.userContentProgress.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserContentProgresses and only return the `user_id`
     * const userContentProgressWithUser_idOnly = await prisma.userContentProgress.updateManyAndReturn({
     *   select: { user_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserContentProgressUpdateManyAndReturnArgs>(args: SelectSubset<T, UserContentProgressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserContentProgressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserContentProgress.
     * @param {UserContentProgressUpsertArgs} args - Arguments to update or create a UserContentProgress.
     * @example
     * // Update or create a UserContentProgress
     * const userContentProgress = await prisma.userContentProgress.upsert({
     *   create: {
     *     // ... data to create a UserContentProgress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserContentProgress we want to update
     *   }
     * })
     */
    upsert<T extends UserContentProgressUpsertArgs>(args: SelectSubset<T, UserContentProgressUpsertArgs<ExtArgs>>): Prisma__UserContentProgressClient<$Result.GetResult<Prisma.$UserContentProgressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserContentProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserContentProgressCountArgs} args - Arguments to filter UserContentProgresses to count.
     * @example
     * // Count the number of UserContentProgresses
     * const count = await prisma.userContentProgress.count({
     *   where: {
     *     // ... the filter for the UserContentProgresses we want to count
     *   }
     * })
    **/
    count<T extends UserContentProgressCountArgs>(
      args?: Subset<T, UserContentProgressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserContentProgressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserContentProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserContentProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserContentProgressAggregateArgs>(args: Subset<T, UserContentProgressAggregateArgs>): Prisma.PrismaPromise<GetUserContentProgressAggregateType<T>>

    /**
     * Group by UserContentProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserContentProgressGroupByArgs} args - Group by arguments.
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
      T extends UserContentProgressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserContentProgressGroupByArgs['orderBy'] }
        : { orderBy?: UserContentProgressGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserContentProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserContentProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserContentProgress model
   */
  readonly fields: UserContentProgressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserContentProgress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserContentProgressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    content<T extends ContentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ContentDefaultArgs<ExtArgs>>): Prisma__ContentClient<$Result.GetResult<Prisma.$ContentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends app_userDefaultArgs<ExtArgs> = {}>(args?: Subset<T, app_userDefaultArgs<ExtArgs>>): Prisma__app_userClient<$Result.GetResult<Prisma.$app_userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the UserContentProgress model
   */
  interface UserContentProgressFieldRefs {
    readonly user_id: FieldRef<"UserContentProgress", 'String'>
    readonly content_id: FieldRef<"UserContentProgress", 'String'>
    readonly completed: FieldRef<"UserContentProgress", 'Boolean'>
    readonly progress: FieldRef<"UserContentProgress", 'Float'>
    readonly last_update: FieldRef<"UserContentProgress", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserContentProgress findUnique
   */
  export type UserContentProgressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserContentProgress
     */
    select?: UserContentProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserContentProgress
     */
    omit?: UserContentProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserContentProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserContentProgress to fetch.
     */
    where: UserContentProgressWhereUniqueInput
  }

  /**
   * UserContentProgress findUniqueOrThrow
   */
  export type UserContentProgressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserContentProgress
     */
    select?: UserContentProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserContentProgress
     */
    omit?: UserContentProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserContentProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserContentProgress to fetch.
     */
    where: UserContentProgressWhereUniqueInput
  }

  /**
   * UserContentProgress findFirst
   */
  export type UserContentProgressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserContentProgress
     */
    select?: UserContentProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserContentProgress
     */
    omit?: UserContentProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserContentProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserContentProgress to fetch.
     */
    where?: UserContentProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserContentProgresses to fetch.
     */
    orderBy?: UserContentProgressOrderByWithRelationInput | UserContentProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserContentProgresses.
     */
    cursor?: UserContentProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserContentProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserContentProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserContentProgresses.
     */
    distinct?: UserContentProgressScalarFieldEnum | UserContentProgressScalarFieldEnum[]
  }

  /**
   * UserContentProgress findFirstOrThrow
   */
  export type UserContentProgressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserContentProgress
     */
    select?: UserContentProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserContentProgress
     */
    omit?: UserContentProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserContentProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserContentProgress to fetch.
     */
    where?: UserContentProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserContentProgresses to fetch.
     */
    orderBy?: UserContentProgressOrderByWithRelationInput | UserContentProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserContentProgresses.
     */
    cursor?: UserContentProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserContentProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserContentProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserContentProgresses.
     */
    distinct?: UserContentProgressScalarFieldEnum | UserContentProgressScalarFieldEnum[]
  }

  /**
   * UserContentProgress findMany
   */
  export type UserContentProgressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserContentProgress
     */
    select?: UserContentProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserContentProgress
     */
    omit?: UserContentProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserContentProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserContentProgresses to fetch.
     */
    where?: UserContentProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserContentProgresses to fetch.
     */
    orderBy?: UserContentProgressOrderByWithRelationInput | UserContentProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserContentProgresses.
     */
    cursor?: UserContentProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserContentProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserContentProgresses.
     */
    skip?: number
    distinct?: UserContentProgressScalarFieldEnum | UserContentProgressScalarFieldEnum[]
  }

  /**
   * UserContentProgress create
   */
  export type UserContentProgressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserContentProgress
     */
    select?: UserContentProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserContentProgress
     */
    omit?: UserContentProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserContentProgressInclude<ExtArgs> | null
    /**
     * The data needed to create a UserContentProgress.
     */
    data: XOR<UserContentProgressCreateInput, UserContentProgressUncheckedCreateInput>
  }

  /**
   * UserContentProgress createMany
   */
  export type UserContentProgressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserContentProgresses.
     */
    data: UserContentProgressCreateManyInput | UserContentProgressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserContentProgress createManyAndReturn
   */
  export type UserContentProgressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserContentProgress
     */
    select?: UserContentProgressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserContentProgress
     */
    omit?: UserContentProgressOmit<ExtArgs> | null
    /**
     * The data used to create many UserContentProgresses.
     */
    data: UserContentProgressCreateManyInput | UserContentProgressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserContentProgressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserContentProgress update
   */
  export type UserContentProgressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserContentProgress
     */
    select?: UserContentProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserContentProgress
     */
    omit?: UserContentProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserContentProgressInclude<ExtArgs> | null
    /**
     * The data needed to update a UserContentProgress.
     */
    data: XOR<UserContentProgressUpdateInput, UserContentProgressUncheckedUpdateInput>
    /**
     * Choose, which UserContentProgress to update.
     */
    where: UserContentProgressWhereUniqueInput
  }

  /**
   * UserContentProgress updateMany
   */
  export type UserContentProgressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserContentProgresses.
     */
    data: XOR<UserContentProgressUpdateManyMutationInput, UserContentProgressUncheckedUpdateManyInput>
    /**
     * Filter which UserContentProgresses to update
     */
    where?: UserContentProgressWhereInput
    /**
     * Limit how many UserContentProgresses to update.
     */
    limit?: number
  }

  /**
   * UserContentProgress updateManyAndReturn
   */
  export type UserContentProgressUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserContentProgress
     */
    select?: UserContentProgressSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserContentProgress
     */
    omit?: UserContentProgressOmit<ExtArgs> | null
    /**
     * The data used to update UserContentProgresses.
     */
    data: XOR<UserContentProgressUpdateManyMutationInput, UserContentProgressUncheckedUpdateManyInput>
    /**
     * Filter which UserContentProgresses to update
     */
    where?: UserContentProgressWhereInput
    /**
     * Limit how many UserContentProgresses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserContentProgressIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserContentProgress upsert
   */
  export type UserContentProgressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserContentProgress
     */
    select?: UserContentProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserContentProgress
     */
    omit?: UserContentProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserContentProgressInclude<ExtArgs> | null
    /**
     * The filter to search for the UserContentProgress to update in case it exists.
     */
    where: UserContentProgressWhereUniqueInput
    /**
     * In case the UserContentProgress found by the `where` argument doesn't exist, create a new UserContentProgress with this data.
     */
    create: XOR<UserContentProgressCreateInput, UserContentProgressUncheckedCreateInput>
    /**
     * In case the UserContentProgress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserContentProgressUpdateInput, UserContentProgressUncheckedUpdateInput>
  }

  /**
   * UserContentProgress delete
   */
  export type UserContentProgressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserContentProgress
     */
    select?: UserContentProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserContentProgress
     */
    omit?: UserContentProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserContentProgressInclude<ExtArgs> | null
    /**
     * Filter which UserContentProgress to delete.
     */
    where: UserContentProgressWhereUniqueInput
  }

  /**
   * UserContentProgress deleteMany
   */
  export type UserContentProgressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserContentProgresses to delete
     */
    where?: UserContentProgressWhereInput
    /**
     * Limit how many UserContentProgresses to delete.
     */
    limit?: number
  }

  /**
   * UserContentProgress without action
   */
  export type UserContentProgressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserContentProgress
     */
    select?: UserContentProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserContentProgress
     */
    omit?: UserContentProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserContentProgressInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    audit_id: string | null
    user_id: string | null
    table_name: string | null
    record_id: string | null
    timestamp: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    audit_id: string | null
    user_id: string | null
    table_name: string | null
    record_id: string | null
    timestamp: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    audit_id: number
    user_id: number
    table_name: number
    record_id: number
    timestamp: number
    details: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    audit_id?: true
    user_id?: true
    table_name?: true
    record_id?: true
    timestamp?: true
  }

  export type AuditLogMaxAggregateInputType = {
    audit_id?: true
    user_id?: true
    table_name?: true
    record_id?: true
    timestamp?: true
  }

  export type AuditLogCountAggregateInputType = {
    audit_id?: true
    user_id?: true
    table_name?: true
    record_id?: true
    timestamp?: true
    details?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    audit_id: string
    user_id: string | null
    table_name: string
    record_id: string | null
    timestamp: Date
    details: JsonValue | null
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    audit_id?: boolean
    user_id?: boolean
    table_name?: boolean
    record_id?: boolean
    timestamp?: boolean
    details?: boolean
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    audit_id?: boolean
    user_id?: boolean
    table_name?: boolean
    record_id?: boolean
    timestamp?: boolean
    details?: boolean
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    audit_id?: boolean
    user_id?: boolean
    table_name?: boolean
    record_id?: boolean
    timestamp?: boolean
    details?: boolean
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    audit_id?: boolean
    user_id?: boolean
    table_name?: boolean
    record_id?: boolean
    timestamp?: boolean
    details?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"audit_id" | "user_id" | "table_name" | "record_id" | "timestamp" | "details", ExtArgs["result"]["auditLog"]>
  export type AuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }
  export type AuditLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }
  export type AuditLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {
      user: Prisma.$app_userPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      audit_id: string
      user_id: string | null
      table_name: string
      record_id: string | null
      timestamp: Date
      details: Prisma.JsonValue | null
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `audit_id`
     * const auditLogWithAudit_idOnly = await prisma.auditLog.findMany({ select: { audit_id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `audit_id`
     * const auditLogWithAudit_idOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { audit_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogs and only return the `audit_id`
     * const auditLogWithAudit_idOnly = await prisma.auditLog.updateManyAndReturn({
     *   select: { audit_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
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
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends AuditLog$userArgs<ExtArgs> = {}>(args?: Subset<T, AuditLog$userArgs<ExtArgs>>): Prisma__app_userClient<$Result.GetResult<Prisma.$app_userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly audit_id: FieldRef<"AuditLog", 'String'>
    readonly user_id: FieldRef<"AuditLog", 'String'>
    readonly table_name: FieldRef<"AuditLog", 'String'>
    readonly record_id: FieldRef<"AuditLog", 'String'>
    readonly timestamp: FieldRef<"AuditLog", 'DateTime'>
    readonly details: FieldRef<"AuditLog", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog.user
   */
  export type AuditLog$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_user
     */
    select?: app_userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_user
     */
    omit?: app_userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_userInclude<ExtArgs> | null
    where?: app_userWhereInput
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationMinAggregateOutputType = {
    notification_id: string | null
    user_id: string | null
    title: string | null
    message: string | null
    read: boolean | null
    created_at: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    notification_id: string | null
    user_id: string | null
    title: string | null
    message: string | null
    read: boolean | null
    created_at: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    notification_id: number
    user_id: number
    title: number
    message: number
    read: number
    created_at: number
    _all: number
  }


  export type NotificationMinAggregateInputType = {
    notification_id?: true
    user_id?: true
    title?: true
    message?: true
    read?: true
    created_at?: true
  }

  export type NotificationMaxAggregateInputType = {
    notification_id?: true
    user_id?: true
    title?: true
    message?: true
    read?: true
    created_at?: true
  }

  export type NotificationCountAggregateInputType = {
    notification_id?: true
    user_id?: true
    title?: true
    message?: true
    read?: true
    created_at?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    notification_id: string
    user_id: string | null
    title: string
    message: string | null
    read: boolean
    created_at: Date
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    notification_id?: boolean
    user_id?: boolean
    title?: boolean
    message?: boolean
    read?: boolean
    created_at?: boolean
    user?: boolean | Notification$userArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    notification_id?: boolean
    user_id?: boolean
    title?: boolean
    message?: boolean
    read?: boolean
    created_at?: boolean
    user?: boolean | Notification$userArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    notification_id?: boolean
    user_id?: boolean
    title?: boolean
    message?: boolean
    read?: boolean
    created_at?: boolean
    user?: boolean | Notification$userArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectScalar = {
    notification_id?: boolean
    user_id?: boolean
    title?: boolean
    message?: boolean
    read?: boolean
    created_at?: boolean
  }

  export type NotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"notification_id" | "user_id" | "title" | "message" | "read" | "created_at", ExtArgs["result"]["notification"]>
  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Notification$userArgs<ExtArgs>
  }
  export type NotificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Notification$userArgs<ExtArgs>
  }
  export type NotificationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Notification$userArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      user: Prisma.$app_userPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      notification_id: string
      user_id: string | null
      title: string
      message: string | null
      read: boolean
      created_at: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `notification_id`
     * const notificationWithNotification_idOnly = await prisma.notification.findMany({ select: { notification_id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notifications and only return the `notification_id`
     * const notificationWithNotification_idOnly = await prisma.notification.createManyAndReturn({
     *   select: { notification_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications and returns the data updated in the database.
     * @param {NotificationUpdateManyAndReturnArgs} args - Arguments to update many Notifications.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Notifications and only return the `notification_id`
     * const notificationWithNotification_idOnly = await prisma.notification.updateManyAndReturn({
     *   select: { notification_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NotificationUpdateManyAndReturnArgs>(args: SelectSubset<T, NotificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
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
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Notification$userArgs<ExtArgs> = {}>(args?: Subset<T, Notification$userArgs<ExtArgs>>): Prisma__app_userClient<$Result.GetResult<Prisma.$app_userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly notification_id: FieldRef<"Notification", 'String'>
    readonly user_id: FieldRef<"Notification", 'String'>
    readonly title: FieldRef<"Notification", 'String'>
    readonly message: FieldRef<"Notification", 'String'>
    readonly read: FieldRef<"Notification", 'Boolean'>
    readonly created_at: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification updateManyAndReturn
   */
  export type NotificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number
  }

  /**
   * Notification.user
   */
  export type Notification$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the app_user
     */
    select?: app_userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the app_user
     */
    omit?: app_userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: app_userInclude<ExtArgs> | null
    where?: app_userWhereInput
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
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


  export const InstitutionScalarFieldEnum: {
    institution_id: 'institution_id',
    name: 'name',
    description: 'description',
    created_at: 'created_at'
  };

  export type InstitutionScalarFieldEnum = (typeof InstitutionScalarFieldEnum)[keyof typeof InstitutionScalarFieldEnum]


  export const StructureScalarFieldEnum: {
    structure_id: 'structure_id',
    institution_id: 'institution_id',
    name: 'name',
    parent_id: 'parent_id',
    description: 'description',
    created_at: 'created_at'
  };

  export type StructureScalarFieldEnum = (typeof StructureScalarFieldEnum)[keyof typeof StructureScalarFieldEnum]


  export const App_userScalarFieldEnum: {
    user_id: 'user_id',
    username: 'username',
    email: 'email',
    firstname: 'firstname',
    lastname: 'lastname',
    role: 'role',
    created_at: 'created_at',
    active: 'active'
  };

  export type App_userScalarFieldEnum = (typeof App_userScalarFieldEnum)[keyof typeof App_userScalarFieldEnum]


  export const UserLinkScalarFieldEnum: {
    link_id: 'link_id',
    id_user_from: 'id_user_from',
    id_user_to: 'id_user_to',
    link_type: 'link_type',
    created_at: 'created_at'
  };

  export type UserLinkScalarFieldEnum = (typeof UserLinkScalarFieldEnum)[keyof typeof UserLinkScalarFieldEnum]


  export const UserStructureScalarFieldEnum: {
    user_id: 'user_id',
    structure_id: 'structure_id'
  };

  export type UserStructureScalarFieldEnum = (typeof UserStructureScalarFieldEnum)[keyof typeof UserStructureScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    session_id: 'session_id',
    user_id: 'user_id',
    token: 'token',
    created_at: 'created_at',
    expires_at: 'expires_at'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const DimensionScalarFieldEnum: {
    dimension_id: 'dimension_id',
    name: 'name',
    description: 'description'
  };

  export type DimensionScalarFieldEnum = (typeof DimensionScalarFieldEnum)[keyof typeof DimensionScalarFieldEnum]


  export const ArchetypeScalarFieldEnum: {
    archetype_id: 'archetype_id',
    dimension_id: 'dimension_id',
    name: 'name',
    description: 'description'
  };

  export type ArchetypeScalarFieldEnum = (typeof ArchetypeScalarFieldEnum)[keyof typeof ArchetypeScalarFieldEnum]


  export const ContentScalarFieldEnum: {
    content_id: 'content_id',
    title: 'title',
    description: 'description',
    prerequisite_id: 'prerequisite_id',
    created_at: 'created_at'
  };

  export type ContentScalarFieldEnum = (typeof ContentScalarFieldEnum)[keyof typeof ContentScalarFieldEnum]


  export const UserContentProgressScalarFieldEnum: {
    user_id: 'user_id',
    content_id: 'content_id',
    completed: 'completed',
    progress: 'progress',
    last_update: 'last_update'
  };

  export type UserContentProgressScalarFieldEnum = (typeof UserContentProgressScalarFieldEnum)[keyof typeof UserContentProgressScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    audit_id: 'audit_id',
    user_id: 'user_id',
    table_name: 'table_name',
    record_id: 'record_id',
    timestamp: 'timestamp',
    details: 'details'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    notification_id: 'notification_id',
    user_id: 'user_id',
    title: 'title',
    message: 'message',
    read: 'read',
    created_at: 'created_at'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


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
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'linkType'
   */
  export type EnumlinkTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'linkType'>
    


  /**
   * Reference to a field of type 'linkType[]'
   */
  export type ListEnumlinkTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'linkType[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type InstitutionWhereInput = {
    AND?: InstitutionWhereInput | InstitutionWhereInput[]
    OR?: InstitutionWhereInput[]
    NOT?: InstitutionWhereInput | InstitutionWhereInput[]
    institution_id?: UuidFilter<"Institution"> | string
    name?: StringNullableFilter<"Institution"> | string | null
    description?: StringNullableFilter<"Institution"> | string | null
    created_at?: DateTimeFilter<"Institution"> | Date | string
    structures?: StructureListRelationFilter
  }

  export type InstitutionOrderByWithRelationInput = {
    institution_id?: SortOrder
    name?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    created_at?: SortOrder
    structures?: StructureOrderByRelationAggregateInput
  }

  export type InstitutionWhereUniqueInput = Prisma.AtLeast<{
    institution_id?: string
    AND?: InstitutionWhereInput | InstitutionWhereInput[]
    OR?: InstitutionWhereInput[]
    NOT?: InstitutionWhereInput | InstitutionWhereInput[]
    name?: StringNullableFilter<"Institution"> | string | null
    description?: StringNullableFilter<"Institution"> | string | null
    created_at?: DateTimeFilter<"Institution"> | Date | string
    structures?: StructureListRelationFilter
  }, "institution_id">

  export type InstitutionOrderByWithAggregationInput = {
    institution_id?: SortOrder
    name?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: InstitutionCountOrderByAggregateInput
    _max?: InstitutionMaxOrderByAggregateInput
    _min?: InstitutionMinOrderByAggregateInput
  }

  export type InstitutionScalarWhereWithAggregatesInput = {
    AND?: InstitutionScalarWhereWithAggregatesInput | InstitutionScalarWhereWithAggregatesInput[]
    OR?: InstitutionScalarWhereWithAggregatesInput[]
    NOT?: InstitutionScalarWhereWithAggregatesInput | InstitutionScalarWhereWithAggregatesInput[]
    institution_id?: UuidWithAggregatesFilter<"Institution"> | string
    name?: StringNullableWithAggregatesFilter<"Institution"> | string | null
    description?: StringNullableWithAggregatesFilter<"Institution"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Institution"> | Date | string
  }

  export type StructureWhereInput = {
    AND?: StructureWhereInput | StructureWhereInput[]
    OR?: StructureWhereInput[]
    NOT?: StructureWhereInput | StructureWhereInput[]
    structure_id?: UuidFilter<"Structure"> | string
    institution_id?: UuidFilter<"Structure"> | string
    name?: StringFilter<"Structure"> | string
    parent_id?: UuidNullableFilter<"Structure"> | string | null
    description?: StringNullableFilter<"Structure"> | string | null
    created_at?: DateTimeFilter<"Structure"> | Date | string
    userStructures?: UserStructureListRelationFilter
    institution?: XOR<InstitutionScalarRelationFilter, InstitutionWhereInput>
    parent?: XOR<StructureNullableScalarRelationFilter, StructureWhereInput> | null
    children?: StructureListRelationFilter
  }

  export type StructureOrderByWithRelationInput = {
    structure_id?: SortOrder
    institution_id?: SortOrder
    name?: SortOrder
    parent_id?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    created_at?: SortOrder
    userStructures?: UserStructureOrderByRelationAggregateInput
    institution?: InstitutionOrderByWithRelationInput
    parent?: StructureOrderByWithRelationInput
    children?: StructureOrderByRelationAggregateInput
  }

  export type StructureWhereUniqueInput = Prisma.AtLeast<{
    structure_id?: string
    AND?: StructureWhereInput | StructureWhereInput[]
    OR?: StructureWhereInput[]
    NOT?: StructureWhereInput | StructureWhereInput[]
    institution_id?: UuidFilter<"Structure"> | string
    name?: StringFilter<"Structure"> | string
    parent_id?: UuidNullableFilter<"Structure"> | string | null
    description?: StringNullableFilter<"Structure"> | string | null
    created_at?: DateTimeFilter<"Structure"> | Date | string
    userStructures?: UserStructureListRelationFilter
    institution?: XOR<InstitutionScalarRelationFilter, InstitutionWhereInput>
    parent?: XOR<StructureNullableScalarRelationFilter, StructureWhereInput> | null
    children?: StructureListRelationFilter
  }, "structure_id">

  export type StructureOrderByWithAggregationInput = {
    structure_id?: SortOrder
    institution_id?: SortOrder
    name?: SortOrder
    parent_id?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: StructureCountOrderByAggregateInput
    _max?: StructureMaxOrderByAggregateInput
    _min?: StructureMinOrderByAggregateInput
  }

  export type StructureScalarWhereWithAggregatesInput = {
    AND?: StructureScalarWhereWithAggregatesInput | StructureScalarWhereWithAggregatesInput[]
    OR?: StructureScalarWhereWithAggregatesInput[]
    NOT?: StructureScalarWhereWithAggregatesInput | StructureScalarWhereWithAggregatesInput[]
    structure_id?: UuidWithAggregatesFilter<"Structure"> | string
    institution_id?: UuidWithAggregatesFilter<"Structure"> | string
    name?: StringWithAggregatesFilter<"Structure"> | string
    parent_id?: UuidNullableWithAggregatesFilter<"Structure"> | string | null
    description?: StringNullableWithAggregatesFilter<"Structure"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Structure"> | Date | string
  }

  export type app_userWhereInput = {
    AND?: app_userWhereInput | app_userWhereInput[]
    OR?: app_userWhereInput[]
    NOT?: app_userWhereInput | app_userWhereInput[]
    user_id?: UuidFilter<"app_user"> | string
    username?: StringFilter<"app_user"> | string
    email?: StringFilter<"app_user"> | string
    firstname?: StringFilter<"app_user"> | string
    lastname?: StringFilter<"app_user"> | string
    role?: StringFilter<"app_user"> | string
    created_at?: DateTimeFilter<"app_user"> | Date | string
    active?: BoolFilter<"app_user"> | boolean
    auditLogs?: AuditLogListRelationFilter
    sessions?: SessionListRelationFilter
    linksFrom?: UserLinkListRelationFilter
    linksTo?: UserLinkListRelationFilter
    userStructures?: UserStructureListRelationFilter
    notifications?: NotificationListRelationFilter
    contentProgress?: UserContentProgressListRelationFilter
  }

  export type app_userOrderByWithRelationInput = {
    user_id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    firstname?: SortOrder
    lastname?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    active?: SortOrder
    auditLogs?: AuditLogOrderByRelationAggregateInput
    sessions?: SessionOrderByRelationAggregateInput
    linksFrom?: UserLinkOrderByRelationAggregateInput
    linksTo?: UserLinkOrderByRelationAggregateInput
    userStructures?: UserStructureOrderByRelationAggregateInput
    notifications?: NotificationOrderByRelationAggregateInput
    contentProgress?: UserContentProgressOrderByRelationAggregateInput
  }

  export type app_userWhereUniqueInput = Prisma.AtLeast<{
    user_id?: string
    AND?: app_userWhereInput | app_userWhereInput[]
    OR?: app_userWhereInput[]
    NOT?: app_userWhereInput | app_userWhereInput[]
    username?: StringFilter<"app_user"> | string
    email?: StringFilter<"app_user"> | string
    firstname?: StringFilter<"app_user"> | string
    lastname?: StringFilter<"app_user"> | string
    role?: StringFilter<"app_user"> | string
    created_at?: DateTimeFilter<"app_user"> | Date | string
    active?: BoolFilter<"app_user"> | boolean
    auditLogs?: AuditLogListRelationFilter
    sessions?: SessionListRelationFilter
    linksFrom?: UserLinkListRelationFilter
    linksTo?: UserLinkListRelationFilter
    userStructures?: UserStructureListRelationFilter
    notifications?: NotificationListRelationFilter
    contentProgress?: UserContentProgressListRelationFilter
  }, "user_id">

  export type app_userOrderByWithAggregationInput = {
    user_id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    firstname?: SortOrder
    lastname?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    active?: SortOrder
    _count?: app_userCountOrderByAggregateInput
    _max?: app_userMaxOrderByAggregateInput
    _min?: app_userMinOrderByAggregateInput
  }

  export type app_userScalarWhereWithAggregatesInput = {
    AND?: app_userScalarWhereWithAggregatesInput | app_userScalarWhereWithAggregatesInput[]
    OR?: app_userScalarWhereWithAggregatesInput[]
    NOT?: app_userScalarWhereWithAggregatesInput | app_userScalarWhereWithAggregatesInput[]
    user_id?: UuidWithAggregatesFilter<"app_user"> | string
    username?: StringWithAggregatesFilter<"app_user"> | string
    email?: StringWithAggregatesFilter<"app_user"> | string
    firstname?: StringWithAggregatesFilter<"app_user"> | string
    lastname?: StringWithAggregatesFilter<"app_user"> | string
    role?: StringWithAggregatesFilter<"app_user"> | string
    created_at?: DateTimeWithAggregatesFilter<"app_user"> | Date | string
    active?: BoolWithAggregatesFilter<"app_user"> | boolean
  }

  export type UserLinkWhereInput = {
    AND?: UserLinkWhereInput | UserLinkWhereInput[]
    OR?: UserLinkWhereInput[]
    NOT?: UserLinkWhereInput | UserLinkWhereInput[]
    link_id?: UuidFilter<"UserLink"> | string
    id_user_from?: UuidNullableFilter<"UserLink"> | string | null
    id_user_to?: UuidNullableFilter<"UserLink"> | string | null
    link_type?: EnumlinkTypeFilter<"UserLink"> | $Enums.linkType
    created_at?: DateTimeFilter<"UserLink"> | Date | string
    userFrom?: XOR<App_userNullableScalarRelationFilter, app_userWhereInput> | null
    userTo?: XOR<App_userNullableScalarRelationFilter, app_userWhereInput> | null
  }

  export type UserLinkOrderByWithRelationInput = {
    link_id?: SortOrder
    id_user_from?: SortOrderInput | SortOrder
    id_user_to?: SortOrderInput | SortOrder
    link_type?: SortOrder
    created_at?: SortOrder
    userFrom?: app_userOrderByWithRelationInput
    userTo?: app_userOrderByWithRelationInput
  }

  export type UserLinkWhereUniqueInput = Prisma.AtLeast<{
    link_id?: string
    id_user_from_id_user_to_link_type?: UserLinkId_user_fromId_user_toLink_typeCompoundUniqueInput
    AND?: UserLinkWhereInput | UserLinkWhereInput[]
    OR?: UserLinkWhereInput[]
    NOT?: UserLinkWhereInput | UserLinkWhereInput[]
    id_user_from?: UuidNullableFilter<"UserLink"> | string | null
    id_user_to?: UuidNullableFilter<"UserLink"> | string | null
    link_type?: EnumlinkTypeFilter<"UserLink"> | $Enums.linkType
    created_at?: DateTimeFilter<"UserLink"> | Date | string
    userFrom?: XOR<App_userNullableScalarRelationFilter, app_userWhereInput> | null
    userTo?: XOR<App_userNullableScalarRelationFilter, app_userWhereInput> | null
  }, "link_id" | "id_user_from_id_user_to_link_type">

  export type UserLinkOrderByWithAggregationInput = {
    link_id?: SortOrder
    id_user_from?: SortOrderInput | SortOrder
    id_user_to?: SortOrderInput | SortOrder
    link_type?: SortOrder
    created_at?: SortOrder
    _count?: UserLinkCountOrderByAggregateInput
    _max?: UserLinkMaxOrderByAggregateInput
    _min?: UserLinkMinOrderByAggregateInput
  }

  export type UserLinkScalarWhereWithAggregatesInput = {
    AND?: UserLinkScalarWhereWithAggregatesInput | UserLinkScalarWhereWithAggregatesInput[]
    OR?: UserLinkScalarWhereWithAggregatesInput[]
    NOT?: UserLinkScalarWhereWithAggregatesInput | UserLinkScalarWhereWithAggregatesInput[]
    link_id?: UuidWithAggregatesFilter<"UserLink"> | string
    id_user_from?: UuidNullableWithAggregatesFilter<"UserLink"> | string | null
    id_user_to?: UuidNullableWithAggregatesFilter<"UserLink"> | string | null
    link_type?: EnumlinkTypeWithAggregatesFilter<"UserLink"> | $Enums.linkType
    created_at?: DateTimeWithAggregatesFilter<"UserLink"> | Date | string
  }

  export type UserStructureWhereInput = {
    AND?: UserStructureWhereInput | UserStructureWhereInput[]
    OR?: UserStructureWhereInput[]
    NOT?: UserStructureWhereInput | UserStructureWhereInput[]
    user_id?: UuidFilter<"UserStructure"> | string
    structure_id?: UuidFilter<"UserStructure"> | string
    structure?: XOR<StructureScalarRelationFilter, StructureWhereInput>
    user?: XOR<App_userScalarRelationFilter, app_userWhereInput>
  }

  export type UserStructureOrderByWithRelationInput = {
    user_id?: SortOrder
    structure_id?: SortOrder
    structure?: StructureOrderByWithRelationInput
    user?: app_userOrderByWithRelationInput
  }

  export type UserStructureWhereUniqueInput = Prisma.AtLeast<{
    user_id_structure_id?: UserStructureUser_idStructure_idCompoundUniqueInput
    AND?: UserStructureWhereInput | UserStructureWhereInput[]
    OR?: UserStructureWhereInput[]
    NOT?: UserStructureWhereInput | UserStructureWhereInput[]
    user_id?: UuidFilter<"UserStructure"> | string
    structure_id?: UuidFilter<"UserStructure"> | string
    structure?: XOR<StructureScalarRelationFilter, StructureWhereInput>
    user?: XOR<App_userScalarRelationFilter, app_userWhereInput>
  }, "user_id_structure_id">

  export type UserStructureOrderByWithAggregationInput = {
    user_id?: SortOrder
    structure_id?: SortOrder
    _count?: UserStructureCountOrderByAggregateInput
    _max?: UserStructureMaxOrderByAggregateInput
    _min?: UserStructureMinOrderByAggregateInput
  }

  export type UserStructureScalarWhereWithAggregatesInput = {
    AND?: UserStructureScalarWhereWithAggregatesInput | UserStructureScalarWhereWithAggregatesInput[]
    OR?: UserStructureScalarWhereWithAggregatesInput[]
    NOT?: UserStructureScalarWhereWithAggregatesInput | UserStructureScalarWhereWithAggregatesInput[]
    user_id?: UuidWithAggregatesFilter<"UserStructure"> | string
    structure_id?: UuidWithAggregatesFilter<"UserStructure"> | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    session_id?: UuidFilter<"Session"> | string
    user_id?: UuidNullableFilter<"Session"> | string | null
    token?: StringFilter<"Session"> | string
    created_at?: DateTimeFilter<"Session"> | Date | string
    expires_at?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<App_userNullableScalarRelationFilter, app_userWhereInput> | null
  }

  export type SessionOrderByWithRelationInput = {
    session_id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    token?: SortOrder
    created_at?: SortOrder
    expires_at?: SortOrder
    user?: app_userOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    session_id?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    user_id?: UuidNullableFilter<"Session"> | string | null
    token?: StringFilter<"Session"> | string
    created_at?: DateTimeFilter<"Session"> | Date | string
    expires_at?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<App_userNullableScalarRelationFilter, app_userWhereInput> | null
  }, "session_id">

  export type SessionOrderByWithAggregationInput = {
    session_id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    token?: SortOrder
    created_at?: SortOrder
    expires_at?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    session_id?: UuidWithAggregatesFilter<"Session"> | string
    user_id?: UuidNullableWithAggregatesFilter<"Session"> | string | null
    token?: StringWithAggregatesFilter<"Session"> | string
    created_at?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    expires_at?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type DimensionWhereInput = {
    AND?: DimensionWhereInput | DimensionWhereInput[]
    OR?: DimensionWhereInput[]
    NOT?: DimensionWhereInput | DimensionWhereInput[]
    dimension_id?: UuidFilter<"Dimension"> | string
    name?: StringFilter<"Dimension"> | string
    description?: StringNullableFilter<"Dimension"> | string | null
    archetypes?: ArchetypeListRelationFilter
  }

  export type DimensionOrderByWithRelationInput = {
    dimension_id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    archetypes?: ArchetypeOrderByRelationAggregateInput
  }

  export type DimensionWhereUniqueInput = Prisma.AtLeast<{
    dimension_id?: string
    AND?: DimensionWhereInput | DimensionWhereInput[]
    OR?: DimensionWhereInput[]
    NOT?: DimensionWhereInput | DimensionWhereInput[]
    name?: StringFilter<"Dimension"> | string
    description?: StringNullableFilter<"Dimension"> | string | null
    archetypes?: ArchetypeListRelationFilter
  }, "dimension_id">

  export type DimensionOrderByWithAggregationInput = {
    dimension_id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    _count?: DimensionCountOrderByAggregateInput
    _max?: DimensionMaxOrderByAggregateInput
    _min?: DimensionMinOrderByAggregateInput
  }

  export type DimensionScalarWhereWithAggregatesInput = {
    AND?: DimensionScalarWhereWithAggregatesInput | DimensionScalarWhereWithAggregatesInput[]
    OR?: DimensionScalarWhereWithAggregatesInput[]
    NOT?: DimensionScalarWhereWithAggregatesInput | DimensionScalarWhereWithAggregatesInput[]
    dimension_id?: UuidWithAggregatesFilter<"Dimension"> | string
    name?: StringWithAggregatesFilter<"Dimension"> | string
    description?: StringNullableWithAggregatesFilter<"Dimension"> | string | null
  }

  export type ArchetypeWhereInput = {
    AND?: ArchetypeWhereInput | ArchetypeWhereInput[]
    OR?: ArchetypeWhereInput[]
    NOT?: ArchetypeWhereInput | ArchetypeWhereInput[]
    archetype_id?: UuidFilter<"Archetype"> | string
    dimension_id?: UuidNullableFilter<"Archetype"> | string | null
    name?: StringFilter<"Archetype"> | string
    description?: StringNullableFilter<"Archetype"> | string | null
    dimension?: XOR<DimensionNullableScalarRelationFilter, DimensionWhereInput> | null
  }

  export type ArchetypeOrderByWithRelationInput = {
    archetype_id?: SortOrder
    dimension_id?: SortOrderInput | SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    dimension?: DimensionOrderByWithRelationInput
  }

  export type ArchetypeWhereUniqueInput = Prisma.AtLeast<{
    archetype_id?: string
    AND?: ArchetypeWhereInput | ArchetypeWhereInput[]
    OR?: ArchetypeWhereInput[]
    NOT?: ArchetypeWhereInput | ArchetypeWhereInput[]
    dimension_id?: UuidNullableFilter<"Archetype"> | string | null
    name?: StringFilter<"Archetype"> | string
    description?: StringNullableFilter<"Archetype"> | string | null
    dimension?: XOR<DimensionNullableScalarRelationFilter, DimensionWhereInput> | null
  }, "archetype_id">

  export type ArchetypeOrderByWithAggregationInput = {
    archetype_id?: SortOrder
    dimension_id?: SortOrderInput | SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    _count?: ArchetypeCountOrderByAggregateInput
    _max?: ArchetypeMaxOrderByAggregateInput
    _min?: ArchetypeMinOrderByAggregateInput
  }

  export type ArchetypeScalarWhereWithAggregatesInput = {
    AND?: ArchetypeScalarWhereWithAggregatesInput | ArchetypeScalarWhereWithAggregatesInput[]
    OR?: ArchetypeScalarWhereWithAggregatesInput[]
    NOT?: ArchetypeScalarWhereWithAggregatesInput | ArchetypeScalarWhereWithAggregatesInput[]
    archetype_id?: UuidWithAggregatesFilter<"Archetype"> | string
    dimension_id?: UuidNullableWithAggregatesFilter<"Archetype"> | string | null
    name?: StringWithAggregatesFilter<"Archetype"> | string
    description?: StringNullableWithAggregatesFilter<"Archetype"> | string | null
  }

  export type ContentWhereInput = {
    AND?: ContentWhereInput | ContentWhereInput[]
    OR?: ContentWhereInput[]
    NOT?: ContentWhereInput | ContentWhereInput[]
    content_id?: UuidFilter<"Content"> | string
    title?: StringFilter<"Content"> | string
    description?: StringNullableFilter<"Content"> | string | null
    prerequisite_id?: UuidNullableFilter<"Content"> | string | null
    created_at?: DateTimeFilter<"Content"> | Date | string
    prerequisite?: XOR<ContentNullableScalarRelationFilter, ContentWhereInput> | null
    prerequisites?: ContentListRelationFilter
    userProgress?: UserContentProgressListRelationFilter
  }

  export type ContentOrderByWithRelationInput = {
    content_id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    prerequisite_id?: SortOrderInput | SortOrder
    created_at?: SortOrder
    prerequisite?: ContentOrderByWithRelationInput
    prerequisites?: ContentOrderByRelationAggregateInput
    userProgress?: UserContentProgressOrderByRelationAggregateInput
  }

  export type ContentWhereUniqueInput = Prisma.AtLeast<{
    content_id?: string
    AND?: ContentWhereInput | ContentWhereInput[]
    OR?: ContentWhereInput[]
    NOT?: ContentWhereInput | ContentWhereInput[]
    title?: StringFilter<"Content"> | string
    description?: StringNullableFilter<"Content"> | string | null
    prerequisite_id?: UuidNullableFilter<"Content"> | string | null
    created_at?: DateTimeFilter<"Content"> | Date | string
    prerequisite?: XOR<ContentNullableScalarRelationFilter, ContentWhereInput> | null
    prerequisites?: ContentListRelationFilter
    userProgress?: UserContentProgressListRelationFilter
  }, "content_id">

  export type ContentOrderByWithAggregationInput = {
    content_id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    prerequisite_id?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: ContentCountOrderByAggregateInput
    _max?: ContentMaxOrderByAggregateInput
    _min?: ContentMinOrderByAggregateInput
  }

  export type ContentScalarWhereWithAggregatesInput = {
    AND?: ContentScalarWhereWithAggregatesInput | ContentScalarWhereWithAggregatesInput[]
    OR?: ContentScalarWhereWithAggregatesInput[]
    NOT?: ContentScalarWhereWithAggregatesInput | ContentScalarWhereWithAggregatesInput[]
    content_id?: UuidWithAggregatesFilter<"Content"> | string
    title?: StringWithAggregatesFilter<"Content"> | string
    description?: StringNullableWithAggregatesFilter<"Content"> | string | null
    prerequisite_id?: UuidNullableWithAggregatesFilter<"Content"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Content"> | Date | string
  }

  export type UserContentProgressWhereInput = {
    AND?: UserContentProgressWhereInput | UserContentProgressWhereInput[]
    OR?: UserContentProgressWhereInput[]
    NOT?: UserContentProgressWhereInput | UserContentProgressWhereInput[]
    user_id?: UuidFilter<"UserContentProgress"> | string
    content_id?: UuidFilter<"UserContentProgress"> | string
    completed?: BoolFilter<"UserContentProgress"> | boolean
    progress?: FloatNullableFilter<"UserContentProgress"> | number | null
    last_update?: DateTimeFilter<"UserContentProgress"> | Date | string
    content?: XOR<ContentScalarRelationFilter, ContentWhereInput>
    user?: XOR<App_userScalarRelationFilter, app_userWhereInput>
  }

  export type UserContentProgressOrderByWithRelationInput = {
    user_id?: SortOrder
    content_id?: SortOrder
    completed?: SortOrder
    progress?: SortOrderInput | SortOrder
    last_update?: SortOrder
    content?: ContentOrderByWithRelationInput
    user?: app_userOrderByWithRelationInput
  }

  export type UserContentProgressWhereUniqueInput = Prisma.AtLeast<{
    user_id_content_id?: UserContentProgressUser_idContent_idCompoundUniqueInput
    AND?: UserContentProgressWhereInput | UserContentProgressWhereInput[]
    OR?: UserContentProgressWhereInput[]
    NOT?: UserContentProgressWhereInput | UserContentProgressWhereInput[]
    user_id?: UuidFilter<"UserContentProgress"> | string
    content_id?: UuidFilter<"UserContentProgress"> | string
    completed?: BoolFilter<"UserContentProgress"> | boolean
    progress?: FloatNullableFilter<"UserContentProgress"> | number | null
    last_update?: DateTimeFilter<"UserContentProgress"> | Date | string
    content?: XOR<ContentScalarRelationFilter, ContentWhereInput>
    user?: XOR<App_userScalarRelationFilter, app_userWhereInput>
  }, "user_id_content_id">

  export type UserContentProgressOrderByWithAggregationInput = {
    user_id?: SortOrder
    content_id?: SortOrder
    completed?: SortOrder
    progress?: SortOrderInput | SortOrder
    last_update?: SortOrder
    _count?: UserContentProgressCountOrderByAggregateInput
    _avg?: UserContentProgressAvgOrderByAggregateInput
    _max?: UserContentProgressMaxOrderByAggregateInput
    _min?: UserContentProgressMinOrderByAggregateInput
    _sum?: UserContentProgressSumOrderByAggregateInput
  }

  export type UserContentProgressScalarWhereWithAggregatesInput = {
    AND?: UserContentProgressScalarWhereWithAggregatesInput | UserContentProgressScalarWhereWithAggregatesInput[]
    OR?: UserContentProgressScalarWhereWithAggregatesInput[]
    NOT?: UserContentProgressScalarWhereWithAggregatesInput | UserContentProgressScalarWhereWithAggregatesInput[]
    user_id?: UuidWithAggregatesFilter<"UserContentProgress"> | string
    content_id?: UuidWithAggregatesFilter<"UserContentProgress"> | string
    completed?: BoolWithAggregatesFilter<"UserContentProgress"> | boolean
    progress?: FloatNullableWithAggregatesFilter<"UserContentProgress"> | number | null
    last_update?: DateTimeWithAggregatesFilter<"UserContentProgress"> | Date | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    audit_id?: UuidFilter<"AuditLog"> | string
    user_id?: UuidNullableFilter<"AuditLog"> | string | null
    table_name?: StringFilter<"AuditLog"> | string
    record_id?: StringNullableFilter<"AuditLog"> | string | null
    timestamp?: DateTimeFilter<"AuditLog"> | Date | string
    details?: JsonNullableFilter<"AuditLog">
    user?: XOR<App_userNullableScalarRelationFilter, app_userWhereInput> | null
  }

  export type AuditLogOrderByWithRelationInput = {
    audit_id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    table_name?: SortOrder
    record_id?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    details?: SortOrderInput | SortOrder
    user?: app_userOrderByWithRelationInput
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    audit_id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    user_id?: UuidNullableFilter<"AuditLog"> | string | null
    table_name?: StringFilter<"AuditLog"> | string
    record_id?: StringNullableFilter<"AuditLog"> | string | null
    timestamp?: DateTimeFilter<"AuditLog"> | Date | string
    details?: JsonNullableFilter<"AuditLog">
    user?: XOR<App_userNullableScalarRelationFilter, app_userWhereInput> | null
  }, "audit_id">

  export type AuditLogOrderByWithAggregationInput = {
    audit_id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    table_name?: SortOrder
    record_id?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    details?: SortOrderInput | SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    audit_id?: UuidWithAggregatesFilter<"AuditLog"> | string
    user_id?: UuidNullableWithAggregatesFilter<"AuditLog"> | string | null
    table_name?: StringWithAggregatesFilter<"AuditLog"> | string
    record_id?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    timestamp?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
    details?: JsonNullableWithAggregatesFilter<"AuditLog">
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    notification_id?: UuidFilter<"Notification"> | string
    user_id?: UuidNullableFilter<"Notification"> | string | null
    title?: StringFilter<"Notification"> | string
    message?: StringNullableFilter<"Notification"> | string | null
    read?: BoolFilter<"Notification"> | boolean
    created_at?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<App_userNullableScalarRelationFilter, app_userWhereInput> | null
  }

  export type NotificationOrderByWithRelationInput = {
    notification_id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    title?: SortOrder
    message?: SortOrderInput | SortOrder
    read?: SortOrder
    created_at?: SortOrder
    user?: app_userOrderByWithRelationInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    notification_id?: string
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    user_id?: UuidNullableFilter<"Notification"> | string | null
    title?: StringFilter<"Notification"> | string
    message?: StringNullableFilter<"Notification"> | string | null
    read?: BoolFilter<"Notification"> | boolean
    created_at?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<App_userNullableScalarRelationFilter, app_userWhereInput> | null
  }, "notification_id">

  export type NotificationOrderByWithAggregationInput = {
    notification_id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    title?: SortOrder
    message?: SortOrderInput | SortOrder
    read?: SortOrder
    created_at?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    notification_id?: UuidWithAggregatesFilter<"Notification"> | string
    user_id?: UuidNullableWithAggregatesFilter<"Notification"> | string | null
    title?: StringWithAggregatesFilter<"Notification"> | string
    message?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    read?: BoolWithAggregatesFilter<"Notification"> | boolean
    created_at?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type InstitutionCreateInput = {
    institution_id?: string
    name?: string | null
    description?: string | null
    created_at?: Date | string
    structures?: StructureCreateNestedManyWithoutInstitutionInput
  }

  export type InstitutionUncheckedCreateInput = {
    institution_id?: string
    name?: string | null
    description?: string | null
    created_at?: Date | string
    structures?: StructureUncheckedCreateNestedManyWithoutInstitutionInput
  }

  export type InstitutionUpdateInput = {
    institution_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    structures?: StructureUpdateManyWithoutInstitutionNestedInput
  }

  export type InstitutionUncheckedUpdateInput = {
    institution_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    structures?: StructureUncheckedUpdateManyWithoutInstitutionNestedInput
  }

  export type InstitutionCreateManyInput = {
    institution_id?: string
    name?: string | null
    description?: string | null
    created_at?: Date | string
  }

  export type InstitutionUpdateManyMutationInput = {
    institution_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InstitutionUncheckedUpdateManyInput = {
    institution_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StructureCreateInput = {
    structure_id?: string
    name: string
    description?: string | null
    created_at?: Date | string
    userStructures?: UserStructureCreateNestedManyWithoutStructureInput
    institution: InstitutionCreateNestedOneWithoutStructuresInput
    parent?: StructureCreateNestedOneWithoutChildrenInput
    children?: StructureCreateNestedManyWithoutParentInput
  }

  export type StructureUncheckedCreateInput = {
    structure_id?: string
    institution_id: string
    name: string
    parent_id?: string | null
    description?: string | null
    created_at?: Date | string
    userStructures?: UserStructureUncheckedCreateNestedManyWithoutStructureInput
    children?: StructureUncheckedCreateNestedManyWithoutParentInput
  }

  export type StructureUpdateInput = {
    structure_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    userStructures?: UserStructureUpdateManyWithoutStructureNestedInput
    institution?: InstitutionUpdateOneRequiredWithoutStructuresNestedInput
    parent?: StructureUpdateOneWithoutChildrenNestedInput
    children?: StructureUpdateManyWithoutParentNestedInput
  }

  export type StructureUncheckedUpdateInput = {
    structure_id?: StringFieldUpdateOperationsInput | string
    institution_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    parent_id?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    userStructures?: UserStructureUncheckedUpdateManyWithoutStructureNestedInput
    children?: StructureUncheckedUpdateManyWithoutParentNestedInput
  }

  export type StructureCreateManyInput = {
    structure_id?: string
    institution_id: string
    name: string
    parent_id?: string | null
    description?: string | null
    created_at?: Date | string
  }

  export type StructureUpdateManyMutationInput = {
    structure_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StructureUncheckedUpdateManyInput = {
    structure_id?: StringFieldUpdateOperationsInput | string
    institution_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    parent_id?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type app_userCreateInput = {
    user_id?: string
    username: string
    email: string
    firstname: string
    lastname: string
    role?: string
    created_at?: Date | string
    active?: boolean
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    linksFrom?: UserLinkCreateNestedManyWithoutUserFromInput
    linksTo?: UserLinkCreateNestedManyWithoutUserToInput
    userStructures?: UserStructureCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    contentProgress?: UserContentProgressCreateNestedManyWithoutUserInput
  }

  export type app_userUncheckedCreateInput = {
    user_id?: string
    username: string
    email: string
    firstname: string
    lastname: string
    role?: string
    created_at?: Date | string
    active?: boolean
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    linksFrom?: UserLinkUncheckedCreateNestedManyWithoutUserFromInput
    linksTo?: UserLinkUncheckedCreateNestedManyWithoutUserToInput
    userStructures?: UserStructureUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    contentProgress?: UserContentProgressUncheckedCreateNestedManyWithoutUserInput
  }

  export type app_userUpdateInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    linksFrom?: UserLinkUpdateManyWithoutUserFromNestedInput
    linksTo?: UserLinkUpdateManyWithoutUserToNestedInput
    userStructures?: UserStructureUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    contentProgress?: UserContentProgressUpdateManyWithoutUserNestedInput
  }

  export type app_userUncheckedUpdateInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    linksFrom?: UserLinkUncheckedUpdateManyWithoutUserFromNestedInput
    linksTo?: UserLinkUncheckedUpdateManyWithoutUserToNestedInput
    userStructures?: UserStructureUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    contentProgress?: UserContentProgressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type app_userCreateManyInput = {
    user_id?: string
    username: string
    email: string
    firstname: string
    lastname: string
    role?: string
    created_at?: Date | string
    active?: boolean
  }

  export type app_userUpdateManyMutationInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type app_userUncheckedUpdateManyInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserLinkCreateInput = {
    link_id?: string
    link_type: $Enums.linkType
    created_at?: Date | string
    userFrom?: app_userCreateNestedOneWithoutLinksFromInput
    userTo?: app_userCreateNestedOneWithoutLinksToInput
  }

  export type UserLinkUncheckedCreateInput = {
    link_id?: string
    id_user_from?: string | null
    id_user_to?: string | null
    link_type: $Enums.linkType
    created_at?: Date | string
  }

  export type UserLinkUpdateInput = {
    link_id?: StringFieldUpdateOperationsInput | string
    link_type?: EnumlinkTypeFieldUpdateOperationsInput | $Enums.linkType
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    userFrom?: app_userUpdateOneWithoutLinksFromNestedInput
    userTo?: app_userUpdateOneWithoutLinksToNestedInput
  }

  export type UserLinkUncheckedUpdateInput = {
    link_id?: StringFieldUpdateOperationsInput | string
    id_user_from?: NullableStringFieldUpdateOperationsInput | string | null
    id_user_to?: NullableStringFieldUpdateOperationsInput | string | null
    link_type?: EnumlinkTypeFieldUpdateOperationsInput | $Enums.linkType
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLinkCreateManyInput = {
    link_id?: string
    id_user_from?: string | null
    id_user_to?: string | null
    link_type: $Enums.linkType
    created_at?: Date | string
  }

  export type UserLinkUpdateManyMutationInput = {
    link_id?: StringFieldUpdateOperationsInput | string
    link_type?: EnumlinkTypeFieldUpdateOperationsInput | $Enums.linkType
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLinkUncheckedUpdateManyInput = {
    link_id?: StringFieldUpdateOperationsInput | string
    id_user_from?: NullableStringFieldUpdateOperationsInput | string | null
    id_user_to?: NullableStringFieldUpdateOperationsInput | string | null
    link_type?: EnumlinkTypeFieldUpdateOperationsInput | $Enums.linkType
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserStructureCreateInput = {
    structure: StructureCreateNestedOneWithoutUserStructuresInput
    user: app_userCreateNestedOneWithoutUserStructuresInput
  }

  export type UserStructureUncheckedCreateInput = {
    user_id: string
    structure_id: string
  }

  export type UserStructureUpdateInput = {
    structure?: StructureUpdateOneRequiredWithoutUserStructuresNestedInput
    user?: app_userUpdateOneRequiredWithoutUserStructuresNestedInput
  }

  export type UserStructureUncheckedUpdateInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    structure_id?: StringFieldUpdateOperationsInput | string
  }

  export type UserStructureCreateManyInput = {
    user_id: string
    structure_id: string
  }

  export type UserStructureUpdateManyMutationInput = {

  }

  export type UserStructureUncheckedUpdateManyInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    structure_id?: StringFieldUpdateOperationsInput | string
  }

  export type SessionCreateInput = {
    session_id?: string
    token: string
    created_at?: Date | string
    expires_at: Date | string
    user?: app_userCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    session_id?: string
    user_id?: string | null
    token: string
    created_at?: Date | string
    expires_at: Date | string
  }

  export type SessionUpdateInput = {
    session_id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: app_userUpdateOneWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    session_id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    token?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    session_id?: string
    user_id?: string | null
    token: string
    created_at?: Date | string
    expires_at: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    session_id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    session_id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    token?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DimensionCreateInput = {
    dimension_id?: string
    name: string
    description?: string | null
    archetypes?: ArchetypeCreateNestedManyWithoutDimensionInput
  }

  export type DimensionUncheckedCreateInput = {
    dimension_id?: string
    name: string
    description?: string | null
    archetypes?: ArchetypeUncheckedCreateNestedManyWithoutDimensionInput
  }

  export type DimensionUpdateInput = {
    dimension_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    archetypes?: ArchetypeUpdateManyWithoutDimensionNestedInput
  }

  export type DimensionUncheckedUpdateInput = {
    dimension_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    archetypes?: ArchetypeUncheckedUpdateManyWithoutDimensionNestedInput
  }

  export type DimensionCreateManyInput = {
    dimension_id?: string
    name: string
    description?: string | null
  }

  export type DimensionUpdateManyMutationInput = {
    dimension_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DimensionUncheckedUpdateManyInput = {
    dimension_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ArchetypeCreateInput = {
    archetype_id?: string
    name: string
    description?: string | null
    dimension?: DimensionCreateNestedOneWithoutArchetypesInput
  }

  export type ArchetypeUncheckedCreateInput = {
    archetype_id?: string
    dimension_id?: string | null
    name: string
    description?: string | null
  }

  export type ArchetypeUpdateInput = {
    archetype_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    dimension?: DimensionUpdateOneWithoutArchetypesNestedInput
  }

  export type ArchetypeUncheckedUpdateInput = {
    archetype_id?: StringFieldUpdateOperationsInput | string
    dimension_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ArchetypeCreateManyInput = {
    archetype_id?: string
    dimension_id?: string | null
    name: string
    description?: string | null
  }

  export type ArchetypeUpdateManyMutationInput = {
    archetype_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ArchetypeUncheckedUpdateManyInput = {
    archetype_id?: StringFieldUpdateOperationsInput | string
    dimension_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ContentCreateInput = {
    content_id?: string
    title: string
    description?: string | null
    created_at?: Date | string
    prerequisite?: ContentCreateNestedOneWithoutPrerequisitesInput
    prerequisites?: ContentCreateNestedManyWithoutPrerequisiteInput
    userProgress?: UserContentProgressCreateNestedManyWithoutContentInput
  }

  export type ContentUncheckedCreateInput = {
    content_id?: string
    title: string
    description?: string | null
    prerequisite_id?: string | null
    created_at?: Date | string
    prerequisites?: ContentUncheckedCreateNestedManyWithoutPrerequisiteInput
    userProgress?: UserContentProgressUncheckedCreateNestedManyWithoutContentInput
  }

  export type ContentUpdateInput = {
    content_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    prerequisite?: ContentUpdateOneWithoutPrerequisitesNestedInput
    prerequisites?: ContentUpdateManyWithoutPrerequisiteNestedInput
    userProgress?: UserContentProgressUpdateManyWithoutContentNestedInput
  }

  export type ContentUncheckedUpdateInput = {
    content_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    prerequisite_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    prerequisites?: ContentUncheckedUpdateManyWithoutPrerequisiteNestedInput
    userProgress?: UserContentProgressUncheckedUpdateManyWithoutContentNestedInput
  }

  export type ContentCreateManyInput = {
    content_id?: string
    title: string
    description?: string | null
    prerequisite_id?: string | null
    created_at?: Date | string
  }

  export type ContentUpdateManyMutationInput = {
    content_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContentUncheckedUpdateManyInput = {
    content_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    prerequisite_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserContentProgressCreateInput = {
    completed?: boolean
    progress?: number | null
    last_update?: Date | string
    content: ContentCreateNestedOneWithoutUserProgressInput
    user: app_userCreateNestedOneWithoutContentProgressInput
  }

  export type UserContentProgressUncheckedCreateInput = {
    user_id: string
    content_id: string
    completed?: boolean
    progress?: number | null
    last_update?: Date | string
  }

  export type UserContentProgressUpdateInput = {
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: NullableFloatFieldUpdateOperationsInput | number | null
    last_update?: DateTimeFieldUpdateOperationsInput | Date | string
    content?: ContentUpdateOneRequiredWithoutUserProgressNestedInput
    user?: app_userUpdateOneRequiredWithoutContentProgressNestedInput
  }

  export type UserContentProgressUncheckedUpdateInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    content_id?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: NullableFloatFieldUpdateOperationsInput | number | null
    last_update?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserContentProgressCreateManyInput = {
    user_id: string
    content_id: string
    completed?: boolean
    progress?: number | null
    last_update?: Date | string
  }

  export type UserContentProgressUpdateManyMutationInput = {
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: NullableFloatFieldUpdateOperationsInput | number | null
    last_update?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserContentProgressUncheckedUpdateManyInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    content_id?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: NullableFloatFieldUpdateOperationsInput | number | null
    last_update?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateInput = {
    audit_id?: string
    table_name: string
    record_id?: string | null
    timestamp?: Date | string
    details?: NullableJsonNullValueInput | InputJsonValue
    user?: app_userCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateInput = {
    audit_id?: string
    user_id?: string | null
    table_name: string
    record_id?: string | null
    timestamp?: Date | string
    details?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AuditLogUpdateInput = {
    audit_id?: StringFieldUpdateOperationsInput | string
    table_name?: StringFieldUpdateOperationsInput | string
    record_id?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    details?: NullableJsonNullValueInput | InputJsonValue
    user?: app_userUpdateOneWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateInput = {
    audit_id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    table_name?: StringFieldUpdateOperationsInput | string
    record_id?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    details?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AuditLogCreateManyInput = {
    audit_id?: string
    user_id?: string | null
    table_name: string
    record_id?: string | null
    timestamp?: Date | string
    details?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AuditLogUpdateManyMutationInput = {
    audit_id?: StringFieldUpdateOperationsInput | string
    table_name?: StringFieldUpdateOperationsInput | string
    record_id?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    details?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AuditLogUncheckedUpdateManyInput = {
    audit_id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    table_name?: StringFieldUpdateOperationsInput | string
    record_id?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    details?: NullableJsonNullValueInput | InputJsonValue
  }

  export type NotificationCreateInput = {
    notification_id?: string
    title: string
    message?: string | null
    read?: boolean
    created_at?: Date | string
    user?: app_userCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateInput = {
    notification_id?: string
    user_id?: string | null
    title: string
    message?: string | null
    read?: boolean
    created_at?: Date | string
  }

  export type NotificationUpdateInput = {
    notification_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: app_userUpdateOneWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    notification_id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    notification_id?: string
    user_id?: string | null
    title: string
    message?: string | null
    read?: boolean
    created_at?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    notification_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    notification_id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
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

  export type StructureListRelationFilter = {
    every?: StructureWhereInput
    some?: StructureWhereInput
    none?: StructureWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type StructureOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InstitutionCountOrderByAggregateInput = {
    institution_id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
  }

  export type InstitutionMaxOrderByAggregateInput = {
    institution_id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
  }

  export type InstitutionMinOrderByAggregateInput = {
    institution_id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
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

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type UserStructureListRelationFilter = {
    every?: UserStructureWhereInput
    some?: UserStructureWhereInput
    none?: UserStructureWhereInput
  }

  export type InstitutionScalarRelationFilter = {
    is?: InstitutionWhereInput
    isNot?: InstitutionWhereInput
  }

  export type StructureNullableScalarRelationFilter = {
    is?: StructureWhereInput | null
    isNot?: StructureWhereInput | null
  }

  export type UserStructureOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StructureCountOrderByAggregateInput = {
    structure_id?: SortOrder
    institution_id?: SortOrder
    name?: SortOrder
    parent_id?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
  }

  export type StructureMaxOrderByAggregateInput = {
    structure_id?: SortOrder
    institution_id?: SortOrder
    name?: SortOrder
    parent_id?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
  }

  export type StructureMinOrderByAggregateInput = {
    structure_id?: SortOrder
    institution_id?: SortOrder
    name?: SortOrder
    parent_id?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
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

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type AuditLogListRelationFilter = {
    every?: AuditLogWhereInput
    some?: AuditLogWhereInput
    none?: AuditLogWhereInput
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type UserLinkListRelationFilter = {
    every?: UserLinkWhereInput
    some?: UserLinkWhereInput
    none?: UserLinkWhereInput
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type UserContentProgressListRelationFilter = {
    every?: UserContentProgressWhereInput
    some?: UserContentProgressWhereInput
    none?: UserContentProgressWhereInput
  }

  export type AuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserLinkOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserContentProgressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type app_userCountOrderByAggregateInput = {
    user_id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    firstname?: SortOrder
    lastname?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    active?: SortOrder
  }

  export type app_userMaxOrderByAggregateInput = {
    user_id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    firstname?: SortOrder
    lastname?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    active?: SortOrder
  }

  export type app_userMinOrderByAggregateInput = {
    user_id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    firstname?: SortOrder
    lastname?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    active?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumlinkTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.linkType | EnumlinkTypeFieldRefInput<$PrismaModel>
    in?: $Enums.linkType[] | ListEnumlinkTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.linkType[] | ListEnumlinkTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumlinkTypeFilter<$PrismaModel> | $Enums.linkType
  }

  export type App_userNullableScalarRelationFilter = {
    is?: app_userWhereInput | null
    isNot?: app_userWhereInput | null
  }

  export type UserLinkId_user_fromId_user_toLink_typeCompoundUniqueInput = {
    id_user_from: string
    id_user_to: string
    link_type: $Enums.linkType
  }

  export type UserLinkCountOrderByAggregateInput = {
    link_id?: SortOrder
    id_user_from?: SortOrder
    id_user_to?: SortOrder
    link_type?: SortOrder
    created_at?: SortOrder
  }

  export type UserLinkMaxOrderByAggregateInput = {
    link_id?: SortOrder
    id_user_from?: SortOrder
    id_user_to?: SortOrder
    link_type?: SortOrder
    created_at?: SortOrder
  }

  export type UserLinkMinOrderByAggregateInput = {
    link_id?: SortOrder
    id_user_from?: SortOrder
    id_user_to?: SortOrder
    link_type?: SortOrder
    created_at?: SortOrder
  }

  export type EnumlinkTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.linkType | EnumlinkTypeFieldRefInput<$PrismaModel>
    in?: $Enums.linkType[] | ListEnumlinkTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.linkType[] | ListEnumlinkTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumlinkTypeWithAggregatesFilter<$PrismaModel> | $Enums.linkType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumlinkTypeFilter<$PrismaModel>
    _max?: NestedEnumlinkTypeFilter<$PrismaModel>
  }

  export type StructureScalarRelationFilter = {
    is?: StructureWhereInput
    isNot?: StructureWhereInput
  }

  export type App_userScalarRelationFilter = {
    is?: app_userWhereInput
    isNot?: app_userWhereInput
  }

  export type UserStructureUser_idStructure_idCompoundUniqueInput = {
    user_id: string
    structure_id: string
  }

  export type UserStructureCountOrderByAggregateInput = {
    user_id?: SortOrder
    structure_id?: SortOrder
  }

  export type UserStructureMaxOrderByAggregateInput = {
    user_id?: SortOrder
    structure_id?: SortOrder
  }

  export type UserStructureMinOrderByAggregateInput = {
    user_id?: SortOrder
    structure_id?: SortOrder
  }

  export type SessionCountOrderByAggregateInput = {
    session_id?: SortOrder
    user_id?: SortOrder
    token?: SortOrder
    created_at?: SortOrder
    expires_at?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    session_id?: SortOrder
    user_id?: SortOrder
    token?: SortOrder
    created_at?: SortOrder
    expires_at?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    session_id?: SortOrder
    user_id?: SortOrder
    token?: SortOrder
    created_at?: SortOrder
    expires_at?: SortOrder
  }

  export type ArchetypeListRelationFilter = {
    every?: ArchetypeWhereInput
    some?: ArchetypeWhereInput
    none?: ArchetypeWhereInput
  }

  export type ArchetypeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DimensionCountOrderByAggregateInput = {
    dimension_id?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type DimensionMaxOrderByAggregateInput = {
    dimension_id?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type DimensionMinOrderByAggregateInput = {
    dimension_id?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type DimensionNullableScalarRelationFilter = {
    is?: DimensionWhereInput | null
    isNot?: DimensionWhereInput | null
  }

  export type ArchetypeCountOrderByAggregateInput = {
    archetype_id?: SortOrder
    dimension_id?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type ArchetypeMaxOrderByAggregateInput = {
    archetype_id?: SortOrder
    dimension_id?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type ArchetypeMinOrderByAggregateInput = {
    archetype_id?: SortOrder
    dimension_id?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type ContentNullableScalarRelationFilter = {
    is?: ContentWhereInput | null
    isNot?: ContentWhereInput | null
  }

  export type ContentListRelationFilter = {
    every?: ContentWhereInput
    some?: ContentWhereInput
    none?: ContentWhereInput
  }

  export type ContentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ContentCountOrderByAggregateInput = {
    content_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    prerequisite_id?: SortOrder
    created_at?: SortOrder
  }

  export type ContentMaxOrderByAggregateInput = {
    content_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    prerequisite_id?: SortOrder
    created_at?: SortOrder
  }

  export type ContentMinOrderByAggregateInput = {
    content_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    prerequisite_id?: SortOrder
    created_at?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type ContentScalarRelationFilter = {
    is?: ContentWhereInput
    isNot?: ContentWhereInput
  }

  export type UserContentProgressUser_idContent_idCompoundUniqueInput = {
    user_id: string
    content_id: string
  }

  export type UserContentProgressCountOrderByAggregateInput = {
    user_id?: SortOrder
    content_id?: SortOrder
    completed?: SortOrder
    progress?: SortOrder
    last_update?: SortOrder
  }

  export type UserContentProgressAvgOrderByAggregateInput = {
    progress?: SortOrder
  }

  export type UserContentProgressMaxOrderByAggregateInput = {
    user_id?: SortOrder
    content_id?: SortOrder
    completed?: SortOrder
    progress?: SortOrder
    last_update?: SortOrder
  }

  export type UserContentProgressMinOrderByAggregateInput = {
    user_id?: SortOrder
    content_id?: SortOrder
    completed?: SortOrder
    progress?: SortOrder
    last_update?: SortOrder
  }

  export type UserContentProgressSumOrderByAggregateInput = {
    progress?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
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
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AuditLogCountOrderByAggregateInput = {
    audit_id?: SortOrder
    user_id?: SortOrder
    table_name?: SortOrder
    record_id?: SortOrder
    timestamp?: SortOrder
    details?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    audit_id?: SortOrder
    user_id?: SortOrder
    table_name?: SortOrder
    record_id?: SortOrder
    timestamp?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    audit_id?: SortOrder
    user_id?: SortOrder
    table_name?: SortOrder
    record_id?: SortOrder
    timestamp?: SortOrder
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
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type NotificationCountOrderByAggregateInput = {
    notification_id?: SortOrder
    user_id?: SortOrder
    title?: SortOrder
    message?: SortOrder
    read?: SortOrder
    created_at?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    notification_id?: SortOrder
    user_id?: SortOrder
    title?: SortOrder
    message?: SortOrder
    read?: SortOrder
    created_at?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    notification_id?: SortOrder
    user_id?: SortOrder
    title?: SortOrder
    message?: SortOrder
    read?: SortOrder
    created_at?: SortOrder
  }

  export type StructureCreateNestedManyWithoutInstitutionInput = {
    create?: XOR<StructureCreateWithoutInstitutionInput, StructureUncheckedCreateWithoutInstitutionInput> | StructureCreateWithoutInstitutionInput[] | StructureUncheckedCreateWithoutInstitutionInput[]
    connectOrCreate?: StructureCreateOrConnectWithoutInstitutionInput | StructureCreateOrConnectWithoutInstitutionInput[]
    createMany?: StructureCreateManyInstitutionInputEnvelope
    connect?: StructureWhereUniqueInput | StructureWhereUniqueInput[]
  }

  export type StructureUncheckedCreateNestedManyWithoutInstitutionInput = {
    create?: XOR<StructureCreateWithoutInstitutionInput, StructureUncheckedCreateWithoutInstitutionInput> | StructureCreateWithoutInstitutionInput[] | StructureUncheckedCreateWithoutInstitutionInput[]
    connectOrCreate?: StructureCreateOrConnectWithoutInstitutionInput | StructureCreateOrConnectWithoutInstitutionInput[]
    createMany?: StructureCreateManyInstitutionInputEnvelope
    connect?: StructureWhereUniqueInput | StructureWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type StructureUpdateManyWithoutInstitutionNestedInput = {
    create?: XOR<StructureCreateWithoutInstitutionInput, StructureUncheckedCreateWithoutInstitutionInput> | StructureCreateWithoutInstitutionInput[] | StructureUncheckedCreateWithoutInstitutionInput[]
    connectOrCreate?: StructureCreateOrConnectWithoutInstitutionInput | StructureCreateOrConnectWithoutInstitutionInput[]
    upsert?: StructureUpsertWithWhereUniqueWithoutInstitutionInput | StructureUpsertWithWhereUniqueWithoutInstitutionInput[]
    createMany?: StructureCreateManyInstitutionInputEnvelope
    set?: StructureWhereUniqueInput | StructureWhereUniqueInput[]
    disconnect?: StructureWhereUniqueInput | StructureWhereUniqueInput[]
    delete?: StructureWhereUniqueInput | StructureWhereUniqueInput[]
    connect?: StructureWhereUniqueInput | StructureWhereUniqueInput[]
    update?: StructureUpdateWithWhereUniqueWithoutInstitutionInput | StructureUpdateWithWhereUniqueWithoutInstitutionInput[]
    updateMany?: StructureUpdateManyWithWhereWithoutInstitutionInput | StructureUpdateManyWithWhereWithoutInstitutionInput[]
    deleteMany?: StructureScalarWhereInput | StructureScalarWhereInput[]
  }

  export type StructureUncheckedUpdateManyWithoutInstitutionNestedInput = {
    create?: XOR<StructureCreateWithoutInstitutionInput, StructureUncheckedCreateWithoutInstitutionInput> | StructureCreateWithoutInstitutionInput[] | StructureUncheckedCreateWithoutInstitutionInput[]
    connectOrCreate?: StructureCreateOrConnectWithoutInstitutionInput | StructureCreateOrConnectWithoutInstitutionInput[]
    upsert?: StructureUpsertWithWhereUniqueWithoutInstitutionInput | StructureUpsertWithWhereUniqueWithoutInstitutionInput[]
    createMany?: StructureCreateManyInstitutionInputEnvelope
    set?: StructureWhereUniqueInput | StructureWhereUniqueInput[]
    disconnect?: StructureWhereUniqueInput | StructureWhereUniqueInput[]
    delete?: StructureWhereUniqueInput | StructureWhereUniqueInput[]
    connect?: StructureWhereUniqueInput | StructureWhereUniqueInput[]
    update?: StructureUpdateWithWhereUniqueWithoutInstitutionInput | StructureUpdateWithWhereUniqueWithoutInstitutionInput[]
    updateMany?: StructureUpdateManyWithWhereWithoutInstitutionInput | StructureUpdateManyWithWhereWithoutInstitutionInput[]
    deleteMany?: StructureScalarWhereInput | StructureScalarWhereInput[]
  }

  export type UserStructureCreateNestedManyWithoutStructureInput = {
    create?: XOR<UserStructureCreateWithoutStructureInput, UserStructureUncheckedCreateWithoutStructureInput> | UserStructureCreateWithoutStructureInput[] | UserStructureUncheckedCreateWithoutStructureInput[]
    connectOrCreate?: UserStructureCreateOrConnectWithoutStructureInput | UserStructureCreateOrConnectWithoutStructureInput[]
    createMany?: UserStructureCreateManyStructureInputEnvelope
    connect?: UserStructureWhereUniqueInput | UserStructureWhereUniqueInput[]
  }

  export type InstitutionCreateNestedOneWithoutStructuresInput = {
    create?: XOR<InstitutionCreateWithoutStructuresInput, InstitutionUncheckedCreateWithoutStructuresInput>
    connectOrCreate?: InstitutionCreateOrConnectWithoutStructuresInput
    connect?: InstitutionWhereUniqueInput
  }

  export type StructureCreateNestedOneWithoutChildrenInput = {
    create?: XOR<StructureCreateWithoutChildrenInput, StructureUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: StructureCreateOrConnectWithoutChildrenInput
    connect?: StructureWhereUniqueInput
  }

  export type StructureCreateNestedManyWithoutParentInput = {
    create?: XOR<StructureCreateWithoutParentInput, StructureUncheckedCreateWithoutParentInput> | StructureCreateWithoutParentInput[] | StructureUncheckedCreateWithoutParentInput[]
    connectOrCreate?: StructureCreateOrConnectWithoutParentInput | StructureCreateOrConnectWithoutParentInput[]
    createMany?: StructureCreateManyParentInputEnvelope
    connect?: StructureWhereUniqueInput | StructureWhereUniqueInput[]
  }

  export type UserStructureUncheckedCreateNestedManyWithoutStructureInput = {
    create?: XOR<UserStructureCreateWithoutStructureInput, UserStructureUncheckedCreateWithoutStructureInput> | UserStructureCreateWithoutStructureInput[] | UserStructureUncheckedCreateWithoutStructureInput[]
    connectOrCreate?: UserStructureCreateOrConnectWithoutStructureInput | UserStructureCreateOrConnectWithoutStructureInput[]
    createMany?: UserStructureCreateManyStructureInputEnvelope
    connect?: UserStructureWhereUniqueInput | UserStructureWhereUniqueInput[]
  }

  export type StructureUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<StructureCreateWithoutParentInput, StructureUncheckedCreateWithoutParentInput> | StructureCreateWithoutParentInput[] | StructureUncheckedCreateWithoutParentInput[]
    connectOrCreate?: StructureCreateOrConnectWithoutParentInput | StructureCreateOrConnectWithoutParentInput[]
    createMany?: StructureCreateManyParentInputEnvelope
    connect?: StructureWhereUniqueInput | StructureWhereUniqueInput[]
  }

  export type UserStructureUpdateManyWithoutStructureNestedInput = {
    create?: XOR<UserStructureCreateWithoutStructureInput, UserStructureUncheckedCreateWithoutStructureInput> | UserStructureCreateWithoutStructureInput[] | UserStructureUncheckedCreateWithoutStructureInput[]
    connectOrCreate?: UserStructureCreateOrConnectWithoutStructureInput | UserStructureCreateOrConnectWithoutStructureInput[]
    upsert?: UserStructureUpsertWithWhereUniqueWithoutStructureInput | UserStructureUpsertWithWhereUniqueWithoutStructureInput[]
    createMany?: UserStructureCreateManyStructureInputEnvelope
    set?: UserStructureWhereUniqueInput | UserStructureWhereUniqueInput[]
    disconnect?: UserStructureWhereUniqueInput | UserStructureWhereUniqueInput[]
    delete?: UserStructureWhereUniqueInput | UserStructureWhereUniqueInput[]
    connect?: UserStructureWhereUniqueInput | UserStructureWhereUniqueInput[]
    update?: UserStructureUpdateWithWhereUniqueWithoutStructureInput | UserStructureUpdateWithWhereUniqueWithoutStructureInput[]
    updateMany?: UserStructureUpdateManyWithWhereWithoutStructureInput | UserStructureUpdateManyWithWhereWithoutStructureInput[]
    deleteMany?: UserStructureScalarWhereInput | UserStructureScalarWhereInput[]
  }

  export type InstitutionUpdateOneRequiredWithoutStructuresNestedInput = {
    create?: XOR<InstitutionCreateWithoutStructuresInput, InstitutionUncheckedCreateWithoutStructuresInput>
    connectOrCreate?: InstitutionCreateOrConnectWithoutStructuresInput
    upsert?: InstitutionUpsertWithoutStructuresInput
    connect?: InstitutionWhereUniqueInput
    update?: XOR<XOR<InstitutionUpdateToOneWithWhereWithoutStructuresInput, InstitutionUpdateWithoutStructuresInput>, InstitutionUncheckedUpdateWithoutStructuresInput>
  }

  export type StructureUpdateOneWithoutChildrenNestedInput = {
    create?: XOR<StructureCreateWithoutChildrenInput, StructureUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: StructureCreateOrConnectWithoutChildrenInput
    upsert?: StructureUpsertWithoutChildrenInput
    disconnect?: StructureWhereInput | boolean
    delete?: StructureWhereInput | boolean
    connect?: StructureWhereUniqueInput
    update?: XOR<XOR<StructureUpdateToOneWithWhereWithoutChildrenInput, StructureUpdateWithoutChildrenInput>, StructureUncheckedUpdateWithoutChildrenInput>
  }

  export type StructureUpdateManyWithoutParentNestedInput = {
    create?: XOR<StructureCreateWithoutParentInput, StructureUncheckedCreateWithoutParentInput> | StructureCreateWithoutParentInput[] | StructureUncheckedCreateWithoutParentInput[]
    connectOrCreate?: StructureCreateOrConnectWithoutParentInput | StructureCreateOrConnectWithoutParentInput[]
    upsert?: StructureUpsertWithWhereUniqueWithoutParentInput | StructureUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: StructureCreateManyParentInputEnvelope
    set?: StructureWhereUniqueInput | StructureWhereUniqueInput[]
    disconnect?: StructureWhereUniqueInput | StructureWhereUniqueInput[]
    delete?: StructureWhereUniqueInput | StructureWhereUniqueInput[]
    connect?: StructureWhereUniqueInput | StructureWhereUniqueInput[]
    update?: StructureUpdateWithWhereUniqueWithoutParentInput | StructureUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: StructureUpdateManyWithWhereWithoutParentInput | StructureUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: StructureScalarWhereInput | StructureScalarWhereInput[]
  }

  export type UserStructureUncheckedUpdateManyWithoutStructureNestedInput = {
    create?: XOR<UserStructureCreateWithoutStructureInput, UserStructureUncheckedCreateWithoutStructureInput> | UserStructureCreateWithoutStructureInput[] | UserStructureUncheckedCreateWithoutStructureInput[]
    connectOrCreate?: UserStructureCreateOrConnectWithoutStructureInput | UserStructureCreateOrConnectWithoutStructureInput[]
    upsert?: UserStructureUpsertWithWhereUniqueWithoutStructureInput | UserStructureUpsertWithWhereUniqueWithoutStructureInput[]
    createMany?: UserStructureCreateManyStructureInputEnvelope
    set?: UserStructureWhereUniqueInput | UserStructureWhereUniqueInput[]
    disconnect?: UserStructureWhereUniqueInput | UserStructureWhereUniqueInput[]
    delete?: UserStructureWhereUniqueInput | UserStructureWhereUniqueInput[]
    connect?: UserStructureWhereUniqueInput | UserStructureWhereUniqueInput[]
    update?: UserStructureUpdateWithWhereUniqueWithoutStructureInput | UserStructureUpdateWithWhereUniqueWithoutStructureInput[]
    updateMany?: UserStructureUpdateManyWithWhereWithoutStructureInput | UserStructureUpdateManyWithWhereWithoutStructureInput[]
    deleteMany?: UserStructureScalarWhereInput | UserStructureScalarWhereInput[]
  }

  export type StructureUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<StructureCreateWithoutParentInput, StructureUncheckedCreateWithoutParentInput> | StructureCreateWithoutParentInput[] | StructureUncheckedCreateWithoutParentInput[]
    connectOrCreate?: StructureCreateOrConnectWithoutParentInput | StructureCreateOrConnectWithoutParentInput[]
    upsert?: StructureUpsertWithWhereUniqueWithoutParentInput | StructureUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: StructureCreateManyParentInputEnvelope
    set?: StructureWhereUniqueInput | StructureWhereUniqueInput[]
    disconnect?: StructureWhereUniqueInput | StructureWhereUniqueInput[]
    delete?: StructureWhereUniqueInput | StructureWhereUniqueInput[]
    connect?: StructureWhereUniqueInput | StructureWhereUniqueInput[]
    update?: StructureUpdateWithWhereUniqueWithoutParentInput | StructureUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: StructureUpdateManyWithWhereWithoutParentInput | StructureUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: StructureScalarWhereInput | StructureScalarWhereInput[]
  }

  export type AuditLogCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type UserLinkCreateNestedManyWithoutUserFromInput = {
    create?: XOR<UserLinkCreateWithoutUserFromInput, UserLinkUncheckedCreateWithoutUserFromInput> | UserLinkCreateWithoutUserFromInput[] | UserLinkUncheckedCreateWithoutUserFromInput[]
    connectOrCreate?: UserLinkCreateOrConnectWithoutUserFromInput | UserLinkCreateOrConnectWithoutUserFromInput[]
    createMany?: UserLinkCreateManyUserFromInputEnvelope
    connect?: UserLinkWhereUniqueInput | UserLinkWhereUniqueInput[]
  }

  export type UserLinkCreateNestedManyWithoutUserToInput = {
    create?: XOR<UserLinkCreateWithoutUserToInput, UserLinkUncheckedCreateWithoutUserToInput> | UserLinkCreateWithoutUserToInput[] | UserLinkUncheckedCreateWithoutUserToInput[]
    connectOrCreate?: UserLinkCreateOrConnectWithoutUserToInput | UserLinkCreateOrConnectWithoutUserToInput[]
    createMany?: UserLinkCreateManyUserToInputEnvelope
    connect?: UserLinkWhereUniqueInput | UserLinkWhereUniqueInput[]
  }

  export type UserStructureCreateNestedManyWithoutUserInput = {
    create?: XOR<UserStructureCreateWithoutUserInput, UserStructureUncheckedCreateWithoutUserInput> | UserStructureCreateWithoutUserInput[] | UserStructureUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserStructureCreateOrConnectWithoutUserInput | UserStructureCreateOrConnectWithoutUserInput[]
    createMany?: UserStructureCreateManyUserInputEnvelope
    connect?: UserStructureWhereUniqueInput | UserStructureWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type UserContentProgressCreateNestedManyWithoutUserInput = {
    create?: XOR<UserContentProgressCreateWithoutUserInput, UserContentProgressUncheckedCreateWithoutUserInput> | UserContentProgressCreateWithoutUserInput[] | UserContentProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserContentProgressCreateOrConnectWithoutUserInput | UserContentProgressCreateOrConnectWithoutUserInput[]
    createMany?: UserContentProgressCreateManyUserInputEnvelope
    connect?: UserContentProgressWhereUniqueInput | UserContentProgressWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type UserLinkUncheckedCreateNestedManyWithoutUserFromInput = {
    create?: XOR<UserLinkCreateWithoutUserFromInput, UserLinkUncheckedCreateWithoutUserFromInput> | UserLinkCreateWithoutUserFromInput[] | UserLinkUncheckedCreateWithoutUserFromInput[]
    connectOrCreate?: UserLinkCreateOrConnectWithoutUserFromInput | UserLinkCreateOrConnectWithoutUserFromInput[]
    createMany?: UserLinkCreateManyUserFromInputEnvelope
    connect?: UserLinkWhereUniqueInput | UserLinkWhereUniqueInput[]
  }

  export type UserLinkUncheckedCreateNestedManyWithoutUserToInput = {
    create?: XOR<UserLinkCreateWithoutUserToInput, UserLinkUncheckedCreateWithoutUserToInput> | UserLinkCreateWithoutUserToInput[] | UserLinkUncheckedCreateWithoutUserToInput[]
    connectOrCreate?: UserLinkCreateOrConnectWithoutUserToInput | UserLinkCreateOrConnectWithoutUserToInput[]
    createMany?: UserLinkCreateManyUserToInputEnvelope
    connect?: UserLinkWhereUniqueInput | UserLinkWhereUniqueInput[]
  }

  export type UserStructureUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserStructureCreateWithoutUserInput, UserStructureUncheckedCreateWithoutUserInput> | UserStructureCreateWithoutUserInput[] | UserStructureUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserStructureCreateOrConnectWithoutUserInput | UserStructureCreateOrConnectWithoutUserInput[]
    createMany?: UserStructureCreateManyUserInputEnvelope
    connect?: UserStructureWhereUniqueInput | UserStructureWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type UserContentProgressUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserContentProgressCreateWithoutUserInput, UserContentProgressUncheckedCreateWithoutUserInput> | UserContentProgressCreateWithoutUserInput[] | UserContentProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserContentProgressCreateOrConnectWithoutUserInput | UserContentProgressCreateOrConnectWithoutUserInput[]
    createMany?: UserContentProgressCreateManyUserInputEnvelope
    connect?: UserContentProgressWhereUniqueInput | UserContentProgressWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type AuditLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type UserLinkUpdateManyWithoutUserFromNestedInput = {
    create?: XOR<UserLinkCreateWithoutUserFromInput, UserLinkUncheckedCreateWithoutUserFromInput> | UserLinkCreateWithoutUserFromInput[] | UserLinkUncheckedCreateWithoutUserFromInput[]
    connectOrCreate?: UserLinkCreateOrConnectWithoutUserFromInput | UserLinkCreateOrConnectWithoutUserFromInput[]
    upsert?: UserLinkUpsertWithWhereUniqueWithoutUserFromInput | UserLinkUpsertWithWhereUniqueWithoutUserFromInput[]
    createMany?: UserLinkCreateManyUserFromInputEnvelope
    set?: UserLinkWhereUniqueInput | UserLinkWhereUniqueInput[]
    disconnect?: UserLinkWhereUniqueInput | UserLinkWhereUniqueInput[]
    delete?: UserLinkWhereUniqueInput | UserLinkWhereUniqueInput[]
    connect?: UserLinkWhereUniqueInput | UserLinkWhereUniqueInput[]
    update?: UserLinkUpdateWithWhereUniqueWithoutUserFromInput | UserLinkUpdateWithWhereUniqueWithoutUserFromInput[]
    updateMany?: UserLinkUpdateManyWithWhereWithoutUserFromInput | UserLinkUpdateManyWithWhereWithoutUserFromInput[]
    deleteMany?: UserLinkScalarWhereInput | UserLinkScalarWhereInput[]
  }

  export type UserLinkUpdateManyWithoutUserToNestedInput = {
    create?: XOR<UserLinkCreateWithoutUserToInput, UserLinkUncheckedCreateWithoutUserToInput> | UserLinkCreateWithoutUserToInput[] | UserLinkUncheckedCreateWithoutUserToInput[]
    connectOrCreate?: UserLinkCreateOrConnectWithoutUserToInput | UserLinkCreateOrConnectWithoutUserToInput[]
    upsert?: UserLinkUpsertWithWhereUniqueWithoutUserToInput | UserLinkUpsertWithWhereUniqueWithoutUserToInput[]
    createMany?: UserLinkCreateManyUserToInputEnvelope
    set?: UserLinkWhereUniqueInput | UserLinkWhereUniqueInput[]
    disconnect?: UserLinkWhereUniqueInput | UserLinkWhereUniqueInput[]
    delete?: UserLinkWhereUniqueInput | UserLinkWhereUniqueInput[]
    connect?: UserLinkWhereUniqueInput | UserLinkWhereUniqueInput[]
    update?: UserLinkUpdateWithWhereUniqueWithoutUserToInput | UserLinkUpdateWithWhereUniqueWithoutUserToInput[]
    updateMany?: UserLinkUpdateManyWithWhereWithoutUserToInput | UserLinkUpdateManyWithWhereWithoutUserToInput[]
    deleteMany?: UserLinkScalarWhereInput | UserLinkScalarWhereInput[]
  }

  export type UserStructureUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserStructureCreateWithoutUserInput, UserStructureUncheckedCreateWithoutUserInput> | UserStructureCreateWithoutUserInput[] | UserStructureUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserStructureCreateOrConnectWithoutUserInput | UserStructureCreateOrConnectWithoutUserInput[]
    upsert?: UserStructureUpsertWithWhereUniqueWithoutUserInput | UserStructureUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserStructureCreateManyUserInputEnvelope
    set?: UserStructureWhereUniqueInput | UserStructureWhereUniqueInput[]
    disconnect?: UserStructureWhereUniqueInput | UserStructureWhereUniqueInput[]
    delete?: UserStructureWhereUniqueInput | UserStructureWhereUniqueInput[]
    connect?: UserStructureWhereUniqueInput | UserStructureWhereUniqueInput[]
    update?: UserStructureUpdateWithWhereUniqueWithoutUserInput | UserStructureUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserStructureUpdateManyWithWhereWithoutUserInput | UserStructureUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserStructureScalarWhereInput | UserStructureScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UserContentProgressUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserContentProgressCreateWithoutUserInput, UserContentProgressUncheckedCreateWithoutUserInput> | UserContentProgressCreateWithoutUserInput[] | UserContentProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserContentProgressCreateOrConnectWithoutUserInput | UserContentProgressCreateOrConnectWithoutUserInput[]
    upsert?: UserContentProgressUpsertWithWhereUniqueWithoutUserInput | UserContentProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserContentProgressCreateManyUserInputEnvelope
    set?: UserContentProgressWhereUniqueInput | UserContentProgressWhereUniqueInput[]
    disconnect?: UserContentProgressWhereUniqueInput | UserContentProgressWhereUniqueInput[]
    delete?: UserContentProgressWhereUniqueInput | UserContentProgressWhereUniqueInput[]
    connect?: UserContentProgressWhereUniqueInput | UserContentProgressWhereUniqueInput[]
    update?: UserContentProgressUpdateWithWhereUniqueWithoutUserInput | UserContentProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserContentProgressUpdateManyWithWhereWithoutUserInput | UserContentProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserContentProgressScalarWhereInput | UserContentProgressScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type UserLinkUncheckedUpdateManyWithoutUserFromNestedInput = {
    create?: XOR<UserLinkCreateWithoutUserFromInput, UserLinkUncheckedCreateWithoutUserFromInput> | UserLinkCreateWithoutUserFromInput[] | UserLinkUncheckedCreateWithoutUserFromInput[]
    connectOrCreate?: UserLinkCreateOrConnectWithoutUserFromInput | UserLinkCreateOrConnectWithoutUserFromInput[]
    upsert?: UserLinkUpsertWithWhereUniqueWithoutUserFromInput | UserLinkUpsertWithWhereUniqueWithoutUserFromInput[]
    createMany?: UserLinkCreateManyUserFromInputEnvelope
    set?: UserLinkWhereUniqueInput | UserLinkWhereUniqueInput[]
    disconnect?: UserLinkWhereUniqueInput | UserLinkWhereUniqueInput[]
    delete?: UserLinkWhereUniqueInput | UserLinkWhereUniqueInput[]
    connect?: UserLinkWhereUniqueInput | UserLinkWhereUniqueInput[]
    update?: UserLinkUpdateWithWhereUniqueWithoutUserFromInput | UserLinkUpdateWithWhereUniqueWithoutUserFromInput[]
    updateMany?: UserLinkUpdateManyWithWhereWithoutUserFromInput | UserLinkUpdateManyWithWhereWithoutUserFromInput[]
    deleteMany?: UserLinkScalarWhereInput | UserLinkScalarWhereInput[]
  }

  export type UserLinkUncheckedUpdateManyWithoutUserToNestedInput = {
    create?: XOR<UserLinkCreateWithoutUserToInput, UserLinkUncheckedCreateWithoutUserToInput> | UserLinkCreateWithoutUserToInput[] | UserLinkUncheckedCreateWithoutUserToInput[]
    connectOrCreate?: UserLinkCreateOrConnectWithoutUserToInput | UserLinkCreateOrConnectWithoutUserToInput[]
    upsert?: UserLinkUpsertWithWhereUniqueWithoutUserToInput | UserLinkUpsertWithWhereUniqueWithoutUserToInput[]
    createMany?: UserLinkCreateManyUserToInputEnvelope
    set?: UserLinkWhereUniqueInput | UserLinkWhereUniqueInput[]
    disconnect?: UserLinkWhereUniqueInput | UserLinkWhereUniqueInput[]
    delete?: UserLinkWhereUniqueInput | UserLinkWhereUniqueInput[]
    connect?: UserLinkWhereUniqueInput | UserLinkWhereUniqueInput[]
    update?: UserLinkUpdateWithWhereUniqueWithoutUserToInput | UserLinkUpdateWithWhereUniqueWithoutUserToInput[]
    updateMany?: UserLinkUpdateManyWithWhereWithoutUserToInput | UserLinkUpdateManyWithWhereWithoutUserToInput[]
    deleteMany?: UserLinkScalarWhereInput | UserLinkScalarWhereInput[]
  }

  export type UserStructureUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserStructureCreateWithoutUserInput, UserStructureUncheckedCreateWithoutUserInput> | UserStructureCreateWithoutUserInput[] | UserStructureUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserStructureCreateOrConnectWithoutUserInput | UserStructureCreateOrConnectWithoutUserInput[]
    upsert?: UserStructureUpsertWithWhereUniqueWithoutUserInput | UserStructureUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserStructureCreateManyUserInputEnvelope
    set?: UserStructureWhereUniqueInput | UserStructureWhereUniqueInput[]
    disconnect?: UserStructureWhereUniqueInput | UserStructureWhereUniqueInput[]
    delete?: UserStructureWhereUniqueInput | UserStructureWhereUniqueInput[]
    connect?: UserStructureWhereUniqueInput | UserStructureWhereUniqueInput[]
    update?: UserStructureUpdateWithWhereUniqueWithoutUserInput | UserStructureUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserStructureUpdateManyWithWhereWithoutUserInput | UserStructureUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserStructureScalarWhereInput | UserStructureScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UserContentProgressUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserContentProgressCreateWithoutUserInput, UserContentProgressUncheckedCreateWithoutUserInput> | UserContentProgressCreateWithoutUserInput[] | UserContentProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserContentProgressCreateOrConnectWithoutUserInput | UserContentProgressCreateOrConnectWithoutUserInput[]
    upsert?: UserContentProgressUpsertWithWhereUniqueWithoutUserInput | UserContentProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserContentProgressCreateManyUserInputEnvelope
    set?: UserContentProgressWhereUniqueInput | UserContentProgressWhereUniqueInput[]
    disconnect?: UserContentProgressWhereUniqueInput | UserContentProgressWhereUniqueInput[]
    delete?: UserContentProgressWhereUniqueInput | UserContentProgressWhereUniqueInput[]
    connect?: UserContentProgressWhereUniqueInput | UserContentProgressWhereUniqueInput[]
    update?: UserContentProgressUpdateWithWhereUniqueWithoutUserInput | UserContentProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserContentProgressUpdateManyWithWhereWithoutUserInput | UserContentProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserContentProgressScalarWhereInput | UserContentProgressScalarWhereInput[]
  }

  export type app_userCreateNestedOneWithoutLinksFromInput = {
    create?: XOR<app_userCreateWithoutLinksFromInput, app_userUncheckedCreateWithoutLinksFromInput>
    connectOrCreate?: app_userCreateOrConnectWithoutLinksFromInput
    connect?: app_userWhereUniqueInput
  }

  export type app_userCreateNestedOneWithoutLinksToInput = {
    create?: XOR<app_userCreateWithoutLinksToInput, app_userUncheckedCreateWithoutLinksToInput>
    connectOrCreate?: app_userCreateOrConnectWithoutLinksToInput
    connect?: app_userWhereUniqueInput
  }

  export type EnumlinkTypeFieldUpdateOperationsInput = {
    set?: $Enums.linkType
  }

  export type app_userUpdateOneWithoutLinksFromNestedInput = {
    create?: XOR<app_userCreateWithoutLinksFromInput, app_userUncheckedCreateWithoutLinksFromInput>
    connectOrCreate?: app_userCreateOrConnectWithoutLinksFromInput
    upsert?: app_userUpsertWithoutLinksFromInput
    disconnect?: app_userWhereInput | boolean
    delete?: app_userWhereInput | boolean
    connect?: app_userWhereUniqueInput
    update?: XOR<XOR<app_userUpdateToOneWithWhereWithoutLinksFromInput, app_userUpdateWithoutLinksFromInput>, app_userUncheckedUpdateWithoutLinksFromInput>
  }

  export type app_userUpdateOneWithoutLinksToNestedInput = {
    create?: XOR<app_userCreateWithoutLinksToInput, app_userUncheckedCreateWithoutLinksToInput>
    connectOrCreate?: app_userCreateOrConnectWithoutLinksToInput
    upsert?: app_userUpsertWithoutLinksToInput
    disconnect?: app_userWhereInput | boolean
    delete?: app_userWhereInput | boolean
    connect?: app_userWhereUniqueInput
    update?: XOR<XOR<app_userUpdateToOneWithWhereWithoutLinksToInput, app_userUpdateWithoutLinksToInput>, app_userUncheckedUpdateWithoutLinksToInput>
  }

  export type StructureCreateNestedOneWithoutUserStructuresInput = {
    create?: XOR<StructureCreateWithoutUserStructuresInput, StructureUncheckedCreateWithoutUserStructuresInput>
    connectOrCreate?: StructureCreateOrConnectWithoutUserStructuresInput
    connect?: StructureWhereUniqueInput
  }

  export type app_userCreateNestedOneWithoutUserStructuresInput = {
    create?: XOR<app_userCreateWithoutUserStructuresInput, app_userUncheckedCreateWithoutUserStructuresInput>
    connectOrCreate?: app_userCreateOrConnectWithoutUserStructuresInput
    connect?: app_userWhereUniqueInput
  }

  export type StructureUpdateOneRequiredWithoutUserStructuresNestedInput = {
    create?: XOR<StructureCreateWithoutUserStructuresInput, StructureUncheckedCreateWithoutUserStructuresInput>
    connectOrCreate?: StructureCreateOrConnectWithoutUserStructuresInput
    upsert?: StructureUpsertWithoutUserStructuresInput
    connect?: StructureWhereUniqueInput
    update?: XOR<XOR<StructureUpdateToOneWithWhereWithoutUserStructuresInput, StructureUpdateWithoutUserStructuresInput>, StructureUncheckedUpdateWithoutUserStructuresInput>
  }

  export type app_userUpdateOneRequiredWithoutUserStructuresNestedInput = {
    create?: XOR<app_userCreateWithoutUserStructuresInput, app_userUncheckedCreateWithoutUserStructuresInput>
    connectOrCreate?: app_userCreateOrConnectWithoutUserStructuresInput
    upsert?: app_userUpsertWithoutUserStructuresInput
    connect?: app_userWhereUniqueInput
    update?: XOR<XOR<app_userUpdateToOneWithWhereWithoutUserStructuresInput, app_userUpdateWithoutUserStructuresInput>, app_userUncheckedUpdateWithoutUserStructuresInput>
  }

  export type app_userCreateNestedOneWithoutSessionsInput = {
    create?: XOR<app_userCreateWithoutSessionsInput, app_userUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: app_userCreateOrConnectWithoutSessionsInput
    connect?: app_userWhereUniqueInput
  }

  export type app_userUpdateOneWithoutSessionsNestedInput = {
    create?: XOR<app_userCreateWithoutSessionsInput, app_userUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: app_userCreateOrConnectWithoutSessionsInput
    upsert?: app_userUpsertWithoutSessionsInput
    disconnect?: app_userWhereInput | boolean
    delete?: app_userWhereInput | boolean
    connect?: app_userWhereUniqueInput
    update?: XOR<XOR<app_userUpdateToOneWithWhereWithoutSessionsInput, app_userUpdateWithoutSessionsInput>, app_userUncheckedUpdateWithoutSessionsInput>
  }

  export type ArchetypeCreateNestedManyWithoutDimensionInput = {
    create?: XOR<ArchetypeCreateWithoutDimensionInput, ArchetypeUncheckedCreateWithoutDimensionInput> | ArchetypeCreateWithoutDimensionInput[] | ArchetypeUncheckedCreateWithoutDimensionInput[]
    connectOrCreate?: ArchetypeCreateOrConnectWithoutDimensionInput | ArchetypeCreateOrConnectWithoutDimensionInput[]
    createMany?: ArchetypeCreateManyDimensionInputEnvelope
    connect?: ArchetypeWhereUniqueInput | ArchetypeWhereUniqueInput[]
  }

  export type ArchetypeUncheckedCreateNestedManyWithoutDimensionInput = {
    create?: XOR<ArchetypeCreateWithoutDimensionInput, ArchetypeUncheckedCreateWithoutDimensionInput> | ArchetypeCreateWithoutDimensionInput[] | ArchetypeUncheckedCreateWithoutDimensionInput[]
    connectOrCreate?: ArchetypeCreateOrConnectWithoutDimensionInput | ArchetypeCreateOrConnectWithoutDimensionInput[]
    createMany?: ArchetypeCreateManyDimensionInputEnvelope
    connect?: ArchetypeWhereUniqueInput | ArchetypeWhereUniqueInput[]
  }

  export type ArchetypeUpdateManyWithoutDimensionNestedInput = {
    create?: XOR<ArchetypeCreateWithoutDimensionInput, ArchetypeUncheckedCreateWithoutDimensionInput> | ArchetypeCreateWithoutDimensionInput[] | ArchetypeUncheckedCreateWithoutDimensionInput[]
    connectOrCreate?: ArchetypeCreateOrConnectWithoutDimensionInput | ArchetypeCreateOrConnectWithoutDimensionInput[]
    upsert?: ArchetypeUpsertWithWhereUniqueWithoutDimensionInput | ArchetypeUpsertWithWhereUniqueWithoutDimensionInput[]
    createMany?: ArchetypeCreateManyDimensionInputEnvelope
    set?: ArchetypeWhereUniqueInput | ArchetypeWhereUniqueInput[]
    disconnect?: ArchetypeWhereUniqueInput | ArchetypeWhereUniqueInput[]
    delete?: ArchetypeWhereUniqueInput | ArchetypeWhereUniqueInput[]
    connect?: ArchetypeWhereUniqueInput | ArchetypeWhereUniqueInput[]
    update?: ArchetypeUpdateWithWhereUniqueWithoutDimensionInput | ArchetypeUpdateWithWhereUniqueWithoutDimensionInput[]
    updateMany?: ArchetypeUpdateManyWithWhereWithoutDimensionInput | ArchetypeUpdateManyWithWhereWithoutDimensionInput[]
    deleteMany?: ArchetypeScalarWhereInput | ArchetypeScalarWhereInput[]
  }

  export type ArchetypeUncheckedUpdateManyWithoutDimensionNestedInput = {
    create?: XOR<ArchetypeCreateWithoutDimensionInput, ArchetypeUncheckedCreateWithoutDimensionInput> | ArchetypeCreateWithoutDimensionInput[] | ArchetypeUncheckedCreateWithoutDimensionInput[]
    connectOrCreate?: ArchetypeCreateOrConnectWithoutDimensionInput | ArchetypeCreateOrConnectWithoutDimensionInput[]
    upsert?: ArchetypeUpsertWithWhereUniqueWithoutDimensionInput | ArchetypeUpsertWithWhereUniqueWithoutDimensionInput[]
    createMany?: ArchetypeCreateManyDimensionInputEnvelope
    set?: ArchetypeWhereUniqueInput | ArchetypeWhereUniqueInput[]
    disconnect?: ArchetypeWhereUniqueInput | ArchetypeWhereUniqueInput[]
    delete?: ArchetypeWhereUniqueInput | ArchetypeWhereUniqueInput[]
    connect?: ArchetypeWhereUniqueInput | ArchetypeWhereUniqueInput[]
    update?: ArchetypeUpdateWithWhereUniqueWithoutDimensionInput | ArchetypeUpdateWithWhereUniqueWithoutDimensionInput[]
    updateMany?: ArchetypeUpdateManyWithWhereWithoutDimensionInput | ArchetypeUpdateManyWithWhereWithoutDimensionInput[]
    deleteMany?: ArchetypeScalarWhereInput | ArchetypeScalarWhereInput[]
  }

  export type DimensionCreateNestedOneWithoutArchetypesInput = {
    create?: XOR<DimensionCreateWithoutArchetypesInput, DimensionUncheckedCreateWithoutArchetypesInput>
    connectOrCreate?: DimensionCreateOrConnectWithoutArchetypesInput
    connect?: DimensionWhereUniqueInput
  }

  export type DimensionUpdateOneWithoutArchetypesNestedInput = {
    create?: XOR<DimensionCreateWithoutArchetypesInput, DimensionUncheckedCreateWithoutArchetypesInput>
    connectOrCreate?: DimensionCreateOrConnectWithoutArchetypesInput
    upsert?: DimensionUpsertWithoutArchetypesInput
    disconnect?: DimensionWhereInput | boolean
    delete?: DimensionWhereInput | boolean
    connect?: DimensionWhereUniqueInput
    update?: XOR<XOR<DimensionUpdateToOneWithWhereWithoutArchetypesInput, DimensionUpdateWithoutArchetypesInput>, DimensionUncheckedUpdateWithoutArchetypesInput>
  }

  export type ContentCreateNestedOneWithoutPrerequisitesInput = {
    create?: XOR<ContentCreateWithoutPrerequisitesInput, ContentUncheckedCreateWithoutPrerequisitesInput>
    connectOrCreate?: ContentCreateOrConnectWithoutPrerequisitesInput
    connect?: ContentWhereUniqueInput
  }

  export type ContentCreateNestedManyWithoutPrerequisiteInput = {
    create?: XOR<ContentCreateWithoutPrerequisiteInput, ContentUncheckedCreateWithoutPrerequisiteInput> | ContentCreateWithoutPrerequisiteInput[] | ContentUncheckedCreateWithoutPrerequisiteInput[]
    connectOrCreate?: ContentCreateOrConnectWithoutPrerequisiteInput | ContentCreateOrConnectWithoutPrerequisiteInput[]
    createMany?: ContentCreateManyPrerequisiteInputEnvelope
    connect?: ContentWhereUniqueInput | ContentWhereUniqueInput[]
  }

  export type UserContentProgressCreateNestedManyWithoutContentInput = {
    create?: XOR<UserContentProgressCreateWithoutContentInput, UserContentProgressUncheckedCreateWithoutContentInput> | UserContentProgressCreateWithoutContentInput[] | UserContentProgressUncheckedCreateWithoutContentInput[]
    connectOrCreate?: UserContentProgressCreateOrConnectWithoutContentInput | UserContentProgressCreateOrConnectWithoutContentInput[]
    createMany?: UserContentProgressCreateManyContentInputEnvelope
    connect?: UserContentProgressWhereUniqueInput | UserContentProgressWhereUniqueInput[]
  }

  export type ContentUncheckedCreateNestedManyWithoutPrerequisiteInput = {
    create?: XOR<ContentCreateWithoutPrerequisiteInput, ContentUncheckedCreateWithoutPrerequisiteInput> | ContentCreateWithoutPrerequisiteInput[] | ContentUncheckedCreateWithoutPrerequisiteInput[]
    connectOrCreate?: ContentCreateOrConnectWithoutPrerequisiteInput | ContentCreateOrConnectWithoutPrerequisiteInput[]
    createMany?: ContentCreateManyPrerequisiteInputEnvelope
    connect?: ContentWhereUniqueInput | ContentWhereUniqueInput[]
  }

  export type UserContentProgressUncheckedCreateNestedManyWithoutContentInput = {
    create?: XOR<UserContentProgressCreateWithoutContentInput, UserContentProgressUncheckedCreateWithoutContentInput> | UserContentProgressCreateWithoutContentInput[] | UserContentProgressUncheckedCreateWithoutContentInput[]
    connectOrCreate?: UserContentProgressCreateOrConnectWithoutContentInput | UserContentProgressCreateOrConnectWithoutContentInput[]
    createMany?: UserContentProgressCreateManyContentInputEnvelope
    connect?: UserContentProgressWhereUniqueInput | UserContentProgressWhereUniqueInput[]
  }

  export type ContentUpdateOneWithoutPrerequisitesNestedInput = {
    create?: XOR<ContentCreateWithoutPrerequisitesInput, ContentUncheckedCreateWithoutPrerequisitesInput>
    connectOrCreate?: ContentCreateOrConnectWithoutPrerequisitesInput
    upsert?: ContentUpsertWithoutPrerequisitesInput
    disconnect?: ContentWhereInput | boolean
    delete?: ContentWhereInput | boolean
    connect?: ContentWhereUniqueInput
    update?: XOR<XOR<ContentUpdateToOneWithWhereWithoutPrerequisitesInput, ContentUpdateWithoutPrerequisitesInput>, ContentUncheckedUpdateWithoutPrerequisitesInput>
  }

  export type ContentUpdateManyWithoutPrerequisiteNestedInput = {
    create?: XOR<ContentCreateWithoutPrerequisiteInput, ContentUncheckedCreateWithoutPrerequisiteInput> | ContentCreateWithoutPrerequisiteInput[] | ContentUncheckedCreateWithoutPrerequisiteInput[]
    connectOrCreate?: ContentCreateOrConnectWithoutPrerequisiteInput | ContentCreateOrConnectWithoutPrerequisiteInput[]
    upsert?: ContentUpsertWithWhereUniqueWithoutPrerequisiteInput | ContentUpsertWithWhereUniqueWithoutPrerequisiteInput[]
    createMany?: ContentCreateManyPrerequisiteInputEnvelope
    set?: ContentWhereUniqueInput | ContentWhereUniqueInput[]
    disconnect?: ContentWhereUniqueInput | ContentWhereUniqueInput[]
    delete?: ContentWhereUniqueInput | ContentWhereUniqueInput[]
    connect?: ContentWhereUniqueInput | ContentWhereUniqueInput[]
    update?: ContentUpdateWithWhereUniqueWithoutPrerequisiteInput | ContentUpdateWithWhereUniqueWithoutPrerequisiteInput[]
    updateMany?: ContentUpdateManyWithWhereWithoutPrerequisiteInput | ContentUpdateManyWithWhereWithoutPrerequisiteInput[]
    deleteMany?: ContentScalarWhereInput | ContentScalarWhereInput[]
  }

  export type UserContentProgressUpdateManyWithoutContentNestedInput = {
    create?: XOR<UserContentProgressCreateWithoutContentInput, UserContentProgressUncheckedCreateWithoutContentInput> | UserContentProgressCreateWithoutContentInput[] | UserContentProgressUncheckedCreateWithoutContentInput[]
    connectOrCreate?: UserContentProgressCreateOrConnectWithoutContentInput | UserContentProgressCreateOrConnectWithoutContentInput[]
    upsert?: UserContentProgressUpsertWithWhereUniqueWithoutContentInput | UserContentProgressUpsertWithWhereUniqueWithoutContentInput[]
    createMany?: UserContentProgressCreateManyContentInputEnvelope
    set?: UserContentProgressWhereUniqueInput | UserContentProgressWhereUniqueInput[]
    disconnect?: UserContentProgressWhereUniqueInput | UserContentProgressWhereUniqueInput[]
    delete?: UserContentProgressWhereUniqueInput | UserContentProgressWhereUniqueInput[]
    connect?: UserContentProgressWhereUniqueInput | UserContentProgressWhereUniqueInput[]
    update?: UserContentProgressUpdateWithWhereUniqueWithoutContentInput | UserContentProgressUpdateWithWhereUniqueWithoutContentInput[]
    updateMany?: UserContentProgressUpdateManyWithWhereWithoutContentInput | UserContentProgressUpdateManyWithWhereWithoutContentInput[]
    deleteMany?: UserContentProgressScalarWhereInput | UserContentProgressScalarWhereInput[]
  }

  export type ContentUncheckedUpdateManyWithoutPrerequisiteNestedInput = {
    create?: XOR<ContentCreateWithoutPrerequisiteInput, ContentUncheckedCreateWithoutPrerequisiteInput> | ContentCreateWithoutPrerequisiteInput[] | ContentUncheckedCreateWithoutPrerequisiteInput[]
    connectOrCreate?: ContentCreateOrConnectWithoutPrerequisiteInput | ContentCreateOrConnectWithoutPrerequisiteInput[]
    upsert?: ContentUpsertWithWhereUniqueWithoutPrerequisiteInput | ContentUpsertWithWhereUniqueWithoutPrerequisiteInput[]
    createMany?: ContentCreateManyPrerequisiteInputEnvelope
    set?: ContentWhereUniqueInput | ContentWhereUniqueInput[]
    disconnect?: ContentWhereUniqueInput | ContentWhereUniqueInput[]
    delete?: ContentWhereUniqueInput | ContentWhereUniqueInput[]
    connect?: ContentWhereUniqueInput | ContentWhereUniqueInput[]
    update?: ContentUpdateWithWhereUniqueWithoutPrerequisiteInput | ContentUpdateWithWhereUniqueWithoutPrerequisiteInput[]
    updateMany?: ContentUpdateManyWithWhereWithoutPrerequisiteInput | ContentUpdateManyWithWhereWithoutPrerequisiteInput[]
    deleteMany?: ContentScalarWhereInput | ContentScalarWhereInput[]
  }

  export type UserContentProgressUncheckedUpdateManyWithoutContentNestedInput = {
    create?: XOR<UserContentProgressCreateWithoutContentInput, UserContentProgressUncheckedCreateWithoutContentInput> | UserContentProgressCreateWithoutContentInput[] | UserContentProgressUncheckedCreateWithoutContentInput[]
    connectOrCreate?: UserContentProgressCreateOrConnectWithoutContentInput | UserContentProgressCreateOrConnectWithoutContentInput[]
    upsert?: UserContentProgressUpsertWithWhereUniqueWithoutContentInput | UserContentProgressUpsertWithWhereUniqueWithoutContentInput[]
    createMany?: UserContentProgressCreateManyContentInputEnvelope
    set?: UserContentProgressWhereUniqueInput | UserContentProgressWhereUniqueInput[]
    disconnect?: UserContentProgressWhereUniqueInput | UserContentProgressWhereUniqueInput[]
    delete?: UserContentProgressWhereUniqueInput | UserContentProgressWhereUniqueInput[]
    connect?: UserContentProgressWhereUniqueInput | UserContentProgressWhereUniqueInput[]
    update?: UserContentProgressUpdateWithWhereUniqueWithoutContentInput | UserContentProgressUpdateWithWhereUniqueWithoutContentInput[]
    updateMany?: UserContentProgressUpdateManyWithWhereWithoutContentInput | UserContentProgressUpdateManyWithWhereWithoutContentInput[]
    deleteMany?: UserContentProgressScalarWhereInput | UserContentProgressScalarWhereInput[]
  }

  export type ContentCreateNestedOneWithoutUserProgressInput = {
    create?: XOR<ContentCreateWithoutUserProgressInput, ContentUncheckedCreateWithoutUserProgressInput>
    connectOrCreate?: ContentCreateOrConnectWithoutUserProgressInput
    connect?: ContentWhereUniqueInput
  }

  export type app_userCreateNestedOneWithoutContentProgressInput = {
    create?: XOR<app_userCreateWithoutContentProgressInput, app_userUncheckedCreateWithoutContentProgressInput>
    connectOrCreate?: app_userCreateOrConnectWithoutContentProgressInput
    connect?: app_userWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ContentUpdateOneRequiredWithoutUserProgressNestedInput = {
    create?: XOR<ContentCreateWithoutUserProgressInput, ContentUncheckedCreateWithoutUserProgressInput>
    connectOrCreate?: ContentCreateOrConnectWithoutUserProgressInput
    upsert?: ContentUpsertWithoutUserProgressInput
    connect?: ContentWhereUniqueInput
    update?: XOR<XOR<ContentUpdateToOneWithWhereWithoutUserProgressInput, ContentUpdateWithoutUserProgressInput>, ContentUncheckedUpdateWithoutUserProgressInput>
  }

  export type app_userUpdateOneRequiredWithoutContentProgressNestedInput = {
    create?: XOR<app_userCreateWithoutContentProgressInput, app_userUncheckedCreateWithoutContentProgressInput>
    connectOrCreate?: app_userCreateOrConnectWithoutContentProgressInput
    upsert?: app_userUpsertWithoutContentProgressInput
    connect?: app_userWhereUniqueInput
    update?: XOR<XOR<app_userUpdateToOneWithWhereWithoutContentProgressInput, app_userUpdateWithoutContentProgressInput>, app_userUncheckedUpdateWithoutContentProgressInput>
  }

  export type app_userCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<app_userCreateWithoutAuditLogsInput, app_userUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: app_userCreateOrConnectWithoutAuditLogsInput
    connect?: app_userWhereUniqueInput
  }

  export type app_userUpdateOneWithoutAuditLogsNestedInput = {
    create?: XOR<app_userCreateWithoutAuditLogsInput, app_userUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: app_userCreateOrConnectWithoutAuditLogsInput
    upsert?: app_userUpsertWithoutAuditLogsInput
    disconnect?: app_userWhereInput | boolean
    delete?: app_userWhereInput | boolean
    connect?: app_userWhereUniqueInput
    update?: XOR<XOR<app_userUpdateToOneWithWhereWithoutAuditLogsInput, app_userUpdateWithoutAuditLogsInput>, app_userUncheckedUpdateWithoutAuditLogsInput>
  }

  export type app_userCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<app_userCreateWithoutNotificationsInput, app_userUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: app_userCreateOrConnectWithoutNotificationsInput
    connect?: app_userWhereUniqueInput
  }

  export type app_userUpdateOneWithoutNotificationsNestedInput = {
    create?: XOR<app_userCreateWithoutNotificationsInput, app_userUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: app_userCreateOrConnectWithoutNotificationsInput
    upsert?: app_userUpsertWithoutNotificationsInput
    disconnect?: app_userWhereInput | boolean
    delete?: app_userWhereInput | boolean
    connect?: app_userWhereUniqueInput
    update?: XOR<XOR<app_userUpdateToOneWithWhereWithoutNotificationsInput, app_userUpdateWithoutNotificationsInput>, app_userUncheckedUpdateWithoutNotificationsInput>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
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

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
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

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
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

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumlinkTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.linkType | EnumlinkTypeFieldRefInput<$PrismaModel>
    in?: $Enums.linkType[] | ListEnumlinkTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.linkType[] | ListEnumlinkTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumlinkTypeFilter<$PrismaModel> | $Enums.linkType
  }

  export type NestedEnumlinkTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.linkType | EnumlinkTypeFieldRefInput<$PrismaModel>
    in?: $Enums.linkType[] | ListEnumlinkTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.linkType[] | ListEnumlinkTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumlinkTypeWithAggregatesFilter<$PrismaModel> | $Enums.linkType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumlinkTypeFilter<$PrismaModel>
    _max?: NestedEnumlinkTypeFilter<$PrismaModel>
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

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
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
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type StructureCreateWithoutInstitutionInput = {
    structure_id?: string
    name: string
    description?: string | null
    created_at?: Date | string
    userStructures?: UserStructureCreateNestedManyWithoutStructureInput
    parent?: StructureCreateNestedOneWithoutChildrenInput
    children?: StructureCreateNestedManyWithoutParentInput
  }

  export type StructureUncheckedCreateWithoutInstitutionInput = {
    structure_id?: string
    name: string
    parent_id?: string | null
    description?: string | null
    created_at?: Date | string
    userStructures?: UserStructureUncheckedCreateNestedManyWithoutStructureInput
    children?: StructureUncheckedCreateNestedManyWithoutParentInput
  }

  export type StructureCreateOrConnectWithoutInstitutionInput = {
    where: StructureWhereUniqueInput
    create: XOR<StructureCreateWithoutInstitutionInput, StructureUncheckedCreateWithoutInstitutionInput>
  }

  export type StructureCreateManyInstitutionInputEnvelope = {
    data: StructureCreateManyInstitutionInput | StructureCreateManyInstitutionInput[]
    skipDuplicates?: boolean
  }

  export type StructureUpsertWithWhereUniqueWithoutInstitutionInput = {
    where: StructureWhereUniqueInput
    update: XOR<StructureUpdateWithoutInstitutionInput, StructureUncheckedUpdateWithoutInstitutionInput>
    create: XOR<StructureCreateWithoutInstitutionInput, StructureUncheckedCreateWithoutInstitutionInput>
  }

  export type StructureUpdateWithWhereUniqueWithoutInstitutionInput = {
    where: StructureWhereUniqueInput
    data: XOR<StructureUpdateWithoutInstitutionInput, StructureUncheckedUpdateWithoutInstitutionInput>
  }

  export type StructureUpdateManyWithWhereWithoutInstitutionInput = {
    where: StructureScalarWhereInput
    data: XOR<StructureUpdateManyMutationInput, StructureUncheckedUpdateManyWithoutInstitutionInput>
  }

  export type StructureScalarWhereInput = {
    AND?: StructureScalarWhereInput | StructureScalarWhereInput[]
    OR?: StructureScalarWhereInput[]
    NOT?: StructureScalarWhereInput | StructureScalarWhereInput[]
    structure_id?: UuidFilter<"Structure"> | string
    institution_id?: UuidFilter<"Structure"> | string
    name?: StringFilter<"Structure"> | string
    parent_id?: UuidNullableFilter<"Structure"> | string | null
    description?: StringNullableFilter<"Structure"> | string | null
    created_at?: DateTimeFilter<"Structure"> | Date | string
  }

  export type UserStructureCreateWithoutStructureInput = {
    user: app_userCreateNestedOneWithoutUserStructuresInput
  }

  export type UserStructureUncheckedCreateWithoutStructureInput = {
    user_id: string
  }

  export type UserStructureCreateOrConnectWithoutStructureInput = {
    where: UserStructureWhereUniqueInput
    create: XOR<UserStructureCreateWithoutStructureInput, UserStructureUncheckedCreateWithoutStructureInput>
  }

  export type UserStructureCreateManyStructureInputEnvelope = {
    data: UserStructureCreateManyStructureInput | UserStructureCreateManyStructureInput[]
    skipDuplicates?: boolean
  }

  export type InstitutionCreateWithoutStructuresInput = {
    institution_id?: string
    name?: string | null
    description?: string | null
    created_at?: Date | string
  }

  export type InstitutionUncheckedCreateWithoutStructuresInput = {
    institution_id?: string
    name?: string | null
    description?: string | null
    created_at?: Date | string
  }

  export type InstitutionCreateOrConnectWithoutStructuresInput = {
    where: InstitutionWhereUniqueInput
    create: XOR<InstitutionCreateWithoutStructuresInput, InstitutionUncheckedCreateWithoutStructuresInput>
  }

  export type StructureCreateWithoutChildrenInput = {
    structure_id?: string
    name: string
    description?: string | null
    created_at?: Date | string
    userStructures?: UserStructureCreateNestedManyWithoutStructureInput
    institution: InstitutionCreateNestedOneWithoutStructuresInput
    parent?: StructureCreateNestedOneWithoutChildrenInput
  }

  export type StructureUncheckedCreateWithoutChildrenInput = {
    structure_id?: string
    institution_id: string
    name: string
    parent_id?: string | null
    description?: string | null
    created_at?: Date | string
    userStructures?: UserStructureUncheckedCreateNestedManyWithoutStructureInput
  }

  export type StructureCreateOrConnectWithoutChildrenInput = {
    where: StructureWhereUniqueInput
    create: XOR<StructureCreateWithoutChildrenInput, StructureUncheckedCreateWithoutChildrenInput>
  }

  export type StructureCreateWithoutParentInput = {
    structure_id?: string
    name: string
    description?: string | null
    created_at?: Date | string
    userStructures?: UserStructureCreateNestedManyWithoutStructureInput
    institution: InstitutionCreateNestedOneWithoutStructuresInput
    children?: StructureCreateNestedManyWithoutParentInput
  }

  export type StructureUncheckedCreateWithoutParentInput = {
    structure_id?: string
    institution_id: string
    name: string
    description?: string | null
    created_at?: Date | string
    userStructures?: UserStructureUncheckedCreateNestedManyWithoutStructureInput
    children?: StructureUncheckedCreateNestedManyWithoutParentInput
  }

  export type StructureCreateOrConnectWithoutParentInput = {
    where: StructureWhereUniqueInput
    create: XOR<StructureCreateWithoutParentInput, StructureUncheckedCreateWithoutParentInput>
  }

  export type StructureCreateManyParentInputEnvelope = {
    data: StructureCreateManyParentInput | StructureCreateManyParentInput[]
    skipDuplicates?: boolean
  }

  export type UserStructureUpsertWithWhereUniqueWithoutStructureInput = {
    where: UserStructureWhereUniqueInput
    update: XOR<UserStructureUpdateWithoutStructureInput, UserStructureUncheckedUpdateWithoutStructureInput>
    create: XOR<UserStructureCreateWithoutStructureInput, UserStructureUncheckedCreateWithoutStructureInput>
  }

  export type UserStructureUpdateWithWhereUniqueWithoutStructureInput = {
    where: UserStructureWhereUniqueInput
    data: XOR<UserStructureUpdateWithoutStructureInput, UserStructureUncheckedUpdateWithoutStructureInput>
  }

  export type UserStructureUpdateManyWithWhereWithoutStructureInput = {
    where: UserStructureScalarWhereInput
    data: XOR<UserStructureUpdateManyMutationInput, UserStructureUncheckedUpdateManyWithoutStructureInput>
  }

  export type UserStructureScalarWhereInput = {
    AND?: UserStructureScalarWhereInput | UserStructureScalarWhereInput[]
    OR?: UserStructureScalarWhereInput[]
    NOT?: UserStructureScalarWhereInput | UserStructureScalarWhereInput[]
    user_id?: UuidFilter<"UserStructure"> | string
    structure_id?: UuidFilter<"UserStructure"> | string
  }

  export type InstitutionUpsertWithoutStructuresInput = {
    update: XOR<InstitutionUpdateWithoutStructuresInput, InstitutionUncheckedUpdateWithoutStructuresInput>
    create: XOR<InstitutionCreateWithoutStructuresInput, InstitutionUncheckedCreateWithoutStructuresInput>
    where?: InstitutionWhereInput
  }

  export type InstitutionUpdateToOneWithWhereWithoutStructuresInput = {
    where?: InstitutionWhereInput
    data: XOR<InstitutionUpdateWithoutStructuresInput, InstitutionUncheckedUpdateWithoutStructuresInput>
  }

  export type InstitutionUpdateWithoutStructuresInput = {
    institution_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InstitutionUncheckedUpdateWithoutStructuresInput = {
    institution_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StructureUpsertWithoutChildrenInput = {
    update: XOR<StructureUpdateWithoutChildrenInput, StructureUncheckedUpdateWithoutChildrenInput>
    create: XOR<StructureCreateWithoutChildrenInput, StructureUncheckedCreateWithoutChildrenInput>
    where?: StructureWhereInput
  }

  export type StructureUpdateToOneWithWhereWithoutChildrenInput = {
    where?: StructureWhereInput
    data: XOR<StructureUpdateWithoutChildrenInput, StructureUncheckedUpdateWithoutChildrenInput>
  }

  export type StructureUpdateWithoutChildrenInput = {
    structure_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    userStructures?: UserStructureUpdateManyWithoutStructureNestedInput
    institution?: InstitutionUpdateOneRequiredWithoutStructuresNestedInput
    parent?: StructureUpdateOneWithoutChildrenNestedInput
  }

  export type StructureUncheckedUpdateWithoutChildrenInput = {
    structure_id?: StringFieldUpdateOperationsInput | string
    institution_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    parent_id?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    userStructures?: UserStructureUncheckedUpdateManyWithoutStructureNestedInput
  }

  export type StructureUpsertWithWhereUniqueWithoutParentInput = {
    where: StructureWhereUniqueInput
    update: XOR<StructureUpdateWithoutParentInput, StructureUncheckedUpdateWithoutParentInput>
    create: XOR<StructureCreateWithoutParentInput, StructureUncheckedCreateWithoutParentInput>
  }

  export type StructureUpdateWithWhereUniqueWithoutParentInput = {
    where: StructureWhereUniqueInput
    data: XOR<StructureUpdateWithoutParentInput, StructureUncheckedUpdateWithoutParentInput>
  }

  export type StructureUpdateManyWithWhereWithoutParentInput = {
    where: StructureScalarWhereInput
    data: XOR<StructureUpdateManyMutationInput, StructureUncheckedUpdateManyWithoutParentInput>
  }

  export type AuditLogCreateWithoutUserInput = {
    audit_id?: string
    table_name: string
    record_id?: string | null
    timestamp?: Date | string
    details?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AuditLogUncheckedCreateWithoutUserInput = {
    audit_id?: string
    table_name: string
    record_id?: string | null
    timestamp?: Date | string
    details?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AuditLogCreateOrConnectWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogCreateManyUserInputEnvelope = {
    data: AuditLogCreateManyUserInput | AuditLogCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionCreateWithoutUserInput = {
    session_id?: string
    token: string
    created_at?: Date | string
    expires_at: Date | string
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    session_id?: string
    token: string
    created_at?: Date | string
    expires_at: Date | string
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserLinkCreateWithoutUserFromInput = {
    link_id?: string
    link_type: $Enums.linkType
    created_at?: Date | string
    userTo?: app_userCreateNestedOneWithoutLinksToInput
  }

  export type UserLinkUncheckedCreateWithoutUserFromInput = {
    link_id?: string
    id_user_to?: string | null
    link_type: $Enums.linkType
    created_at?: Date | string
  }

  export type UserLinkCreateOrConnectWithoutUserFromInput = {
    where: UserLinkWhereUniqueInput
    create: XOR<UserLinkCreateWithoutUserFromInput, UserLinkUncheckedCreateWithoutUserFromInput>
  }

  export type UserLinkCreateManyUserFromInputEnvelope = {
    data: UserLinkCreateManyUserFromInput | UserLinkCreateManyUserFromInput[]
    skipDuplicates?: boolean
  }

  export type UserLinkCreateWithoutUserToInput = {
    link_id?: string
    link_type: $Enums.linkType
    created_at?: Date | string
    userFrom?: app_userCreateNestedOneWithoutLinksFromInput
  }

  export type UserLinkUncheckedCreateWithoutUserToInput = {
    link_id?: string
    id_user_from?: string | null
    link_type: $Enums.linkType
    created_at?: Date | string
  }

  export type UserLinkCreateOrConnectWithoutUserToInput = {
    where: UserLinkWhereUniqueInput
    create: XOR<UserLinkCreateWithoutUserToInput, UserLinkUncheckedCreateWithoutUserToInput>
  }

  export type UserLinkCreateManyUserToInputEnvelope = {
    data: UserLinkCreateManyUserToInput | UserLinkCreateManyUserToInput[]
    skipDuplicates?: boolean
  }

  export type UserStructureCreateWithoutUserInput = {
    structure: StructureCreateNestedOneWithoutUserStructuresInput
  }

  export type UserStructureUncheckedCreateWithoutUserInput = {
    structure_id: string
  }

  export type UserStructureCreateOrConnectWithoutUserInput = {
    where: UserStructureWhereUniqueInput
    create: XOR<UserStructureCreateWithoutUserInput, UserStructureUncheckedCreateWithoutUserInput>
  }

  export type UserStructureCreateManyUserInputEnvelope = {
    data: UserStructureCreateManyUserInput | UserStructureCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutUserInput = {
    notification_id?: string
    title: string
    message?: string | null
    read?: boolean
    created_at?: Date | string
  }

  export type NotificationUncheckedCreateWithoutUserInput = {
    notification_id?: string
    title: string
    message?: string | null
    read?: boolean
    created_at?: Date | string
  }

  export type NotificationCreateOrConnectWithoutUserInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationCreateManyUserInputEnvelope = {
    data: NotificationCreateManyUserInput | NotificationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserContentProgressCreateWithoutUserInput = {
    completed?: boolean
    progress?: number | null
    last_update?: Date | string
    content: ContentCreateNestedOneWithoutUserProgressInput
  }

  export type UserContentProgressUncheckedCreateWithoutUserInput = {
    content_id: string
    completed?: boolean
    progress?: number | null
    last_update?: Date | string
  }

  export type UserContentProgressCreateOrConnectWithoutUserInput = {
    where: UserContentProgressWhereUniqueInput
    create: XOR<UserContentProgressCreateWithoutUserInput, UserContentProgressUncheckedCreateWithoutUserInput>
  }

  export type UserContentProgressCreateManyUserInputEnvelope = {
    data: UserContentProgressCreateManyUserInput | UserContentProgressCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AuditLogUpsertWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutUserInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutUserInput>
  }

  export type AuditLogScalarWhereInput = {
    AND?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    OR?: AuditLogScalarWhereInput[]
    NOT?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    audit_id?: UuidFilter<"AuditLog"> | string
    user_id?: UuidNullableFilter<"AuditLog"> | string | null
    table_name?: StringFilter<"AuditLog"> | string
    record_id?: StringNullableFilter<"AuditLog"> | string | null
    timestamp?: DateTimeFilter<"AuditLog"> | Date | string
    details?: JsonNullableFilter<"AuditLog">
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    session_id?: UuidFilter<"Session"> | string
    user_id?: UuidNullableFilter<"Session"> | string | null
    token?: StringFilter<"Session"> | string
    created_at?: DateTimeFilter<"Session"> | Date | string
    expires_at?: DateTimeFilter<"Session"> | Date | string
  }

  export type UserLinkUpsertWithWhereUniqueWithoutUserFromInput = {
    where: UserLinkWhereUniqueInput
    update: XOR<UserLinkUpdateWithoutUserFromInput, UserLinkUncheckedUpdateWithoutUserFromInput>
    create: XOR<UserLinkCreateWithoutUserFromInput, UserLinkUncheckedCreateWithoutUserFromInput>
  }

  export type UserLinkUpdateWithWhereUniqueWithoutUserFromInput = {
    where: UserLinkWhereUniqueInput
    data: XOR<UserLinkUpdateWithoutUserFromInput, UserLinkUncheckedUpdateWithoutUserFromInput>
  }

  export type UserLinkUpdateManyWithWhereWithoutUserFromInput = {
    where: UserLinkScalarWhereInput
    data: XOR<UserLinkUpdateManyMutationInput, UserLinkUncheckedUpdateManyWithoutUserFromInput>
  }

  export type UserLinkScalarWhereInput = {
    AND?: UserLinkScalarWhereInput | UserLinkScalarWhereInput[]
    OR?: UserLinkScalarWhereInput[]
    NOT?: UserLinkScalarWhereInput | UserLinkScalarWhereInput[]
    link_id?: UuidFilter<"UserLink"> | string
    id_user_from?: UuidNullableFilter<"UserLink"> | string | null
    id_user_to?: UuidNullableFilter<"UserLink"> | string | null
    link_type?: EnumlinkTypeFilter<"UserLink"> | $Enums.linkType
    created_at?: DateTimeFilter<"UserLink"> | Date | string
  }

  export type UserLinkUpsertWithWhereUniqueWithoutUserToInput = {
    where: UserLinkWhereUniqueInput
    update: XOR<UserLinkUpdateWithoutUserToInput, UserLinkUncheckedUpdateWithoutUserToInput>
    create: XOR<UserLinkCreateWithoutUserToInput, UserLinkUncheckedCreateWithoutUserToInput>
  }

  export type UserLinkUpdateWithWhereUniqueWithoutUserToInput = {
    where: UserLinkWhereUniqueInput
    data: XOR<UserLinkUpdateWithoutUserToInput, UserLinkUncheckedUpdateWithoutUserToInput>
  }

  export type UserLinkUpdateManyWithWhereWithoutUserToInput = {
    where: UserLinkScalarWhereInput
    data: XOR<UserLinkUpdateManyMutationInput, UserLinkUncheckedUpdateManyWithoutUserToInput>
  }

  export type UserStructureUpsertWithWhereUniqueWithoutUserInput = {
    where: UserStructureWhereUniqueInput
    update: XOR<UserStructureUpdateWithoutUserInput, UserStructureUncheckedUpdateWithoutUserInput>
    create: XOR<UserStructureCreateWithoutUserInput, UserStructureUncheckedCreateWithoutUserInput>
  }

  export type UserStructureUpdateWithWhereUniqueWithoutUserInput = {
    where: UserStructureWhereUniqueInput
    data: XOR<UserStructureUpdateWithoutUserInput, UserStructureUncheckedUpdateWithoutUserInput>
  }

  export type UserStructureUpdateManyWithWhereWithoutUserInput = {
    where: UserStructureScalarWhereInput
    data: XOR<UserStructureUpdateManyMutationInput, UserStructureUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationUpsertWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
  }

  export type NotificationUpdateManyWithWhereWithoutUserInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    notification_id?: UuidFilter<"Notification"> | string
    user_id?: UuidNullableFilter<"Notification"> | string | null
    title?: StringFilter<"Notification"> | string
    message?: StringNullableFilter<"Notification"> | string | null
    read?: BoolFilter<"Notification"> | boolean
    created_at?: DateTimeFilter<"Notification"> | Date | string
  }

  export type UserContentProgressUpsertWithWhereUniqueWithoutUserInput = {
    where: UserContentProgressWhereUniqueInput
    update: XOR<UserContentProgressUpdateWithoutUserInput, UserContentProgressUncheckedUpdateWithoutUserInput>
    create: XOR<UserContentProgressCreateWithoutUserInput, UserContentProgressUncheckedCreateWithoutUserInput>
  }

  export type UserContentProgressUpdateWithWhereUniqueWithoutUserInput = {
    where: UserContentProgressWhereUniqueInput
    data: XOR<UserContentProgressUpdateWithoutUserInput, UserContentProgressUncheckedUpdateWithoutUserInput>
  }

  export type UserContentProgressUpdateManyWithWhereWithoutUserInput = {
    where: UserContentProgressScalarWhereInput
    data: XOR<UserContentProgressUpdateManyMutationInput, UserContentProgressUncheckedUpdateManyWithoutUserInput>
  }

  export type UserContentProgressScalarWhereInput = {
    AND?: UserContentProgressScalarWhereInput | UserContentProgressScalarWhereInput[]
    OR?: UserContentProgressScalarWhereInput[]
    NOT?: UserContentProgressScalarWhereInput | UserContentProgressScalarWhereInput[]
    user_id?: UuidFilter<"UserContentProgress"> | string
    content_id?: UuidFilter<"UserContentProgress"> | string
    completed?: BoolFilter<"UserContentProgress"> | boolean
    progress?: FloatNullableFilter<"UserContentProgress"> | number | null
    last_update?: DateTimeFilter<"UserContentProgress"> | Date | string
  }

  export type app_userCreateWithoutLinksFromInput = {
    user_id?: string
    username: string
    email: string
    firstname: string
    lastname: string
    role?: string
    created_at?: Date | string
    active?: boolean
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    linksTo?: UserLinkCreateNestedManyWithoutUserToInput
    userStructures?: UserStructureCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    contentProgress?: UserContentProgressCreateNestedManyWithoutUserInput
  }

  export type app_userUncheckedCreateWithoutLinksFromInput = {
    user_id?: string
    username: string
    email: string
    firstname: string
    lastname: string
    role?: string
    created_at?: Date | string
    active?: boolean
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    linksTo?: UserLinkUncheckedCreateNestedManyWithoutUserToInput
    userStructures?: UserStructureUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    contentProgress?: UserContentProgressUncheckedCreateNestedManyWithoutUserInput
  }

  export type app_userCreateOrConnectWithoutLinksFromInput = {
    where: app_userWhereUniqueInput
    create: XOR<app_userCreateWithoutLinksFromInput, app_userUncheckedCreateWithoutLinksFromInput>
  }

  export type app_userCreateWithoutLinksToInput = {
    user_id?: string
    username: string
    email: string
    firstname: string
    lastname: string
    role?: string
    created_at?: Date | string
    active?: boolean
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    linksFrom?: UserLinkCreateNestedManyWithoutUserFromInput
    userStructures?: UserStructureCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    contentProgress?: UserContentProgressCreateNestedManyWithoutUserInput
  }

  export type app_userUncheckedCreateWithoutLinksToInput = {
    user_id?: string
    username: string
    email: string
    firstname: string
    lastname: string
    role?: string
    created_at?: Date | string
    active?: boolean
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    linksFrom?: UserLinkUncheckedCreateNestedManyWithoutUserFromInput
    userStructures?: UserStructureUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    contentProgress?: UserContentProgressUncheckedCreateNestedManyWithoutUserInput
  }

  export type app_userCreateOrConnectWithoutLinksToInput = {
    where: app_userWhereUniqueInput
    create: XOR<app_userCreateWithoutLinksToInput, app_userUncheckedCreateWithoutLinksToInput>
  }

  export type app_userUpsertWithoutLinksFromInput = {
    update: XOR<app_userUpdateWithoutLinksFromInput, app_userUncheckedUpdateWithoutLinksFromInput>
    create: XOR<app_userCreateWithoutLinksFromInput, app_userUncheckedCreateWithoutLinksFromInput>
    where?: app_userWhereInput
  }

  export type app_userUpdateToOneWithWhereWithoutLinksFromInput = {
    where?: app_userWhereInput
    data: XOR<app_userUpdateWithoutLinksFromInput, app_userUncheckedUpdateWithoutLinksFromInput>
  }

  export type app_userUpdateWithoutLinksFromInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    linksTo?: UserLinkUpdateManyWithoutUserToNestedInput
    userStructures?: UserStructureUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    contentProgress?: UserContentProgressUpdateManyWithoutUserNestedInput
  }

  export type app_userUncheckedUpdateWithoutLinksFromInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    linksTo?: UserLinkUncheckedUpdateManyWithoutUserToNestedInput
    userStructures?: UserStructureUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    contentProgress?: UserContentProgressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type app_userUpsertWithoutLinksToInput = {
    update: XOR<app_userUpdateWithoutLinksToInput, app_userUncheckedUpdateWithoutLinksToInput>
    create: XOR<app_userCreateWithoutLinksToInput, app_userUncheckedCreateWithoutLinksToInput>
    where?: app_userWhereInput
  }

  export type app_userUpdateToOneWithWhereWithoutLinksToInput = {
    where?: app_userWhereInput
    data: XOR<app_userUpdateWithoutLinksToInput, app_userUncheckedUpdateWithoutLinksToInput>
  }

  export type app_userUpdateWithoutLinksToInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    linksFrom?: UserLinkUpdateManyWithoutUserFromNestedInput
    userStructures?: UserStructureUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    contentProgress?: UserContentProgressUpdateManyWithoutUserNestedInput
  }

  export type app_userUncheckedUpdateWithoutLinksToInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    linksFrom?: UserLinkUncheckedUpdateManyWithoutUserFromNestedInput
    userStructures?: UserStructureUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    contentProgress?: UserContentProgressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type StructureCreateWithoutUserStructuresInput = {
    structure_id?: string
    name: string
    description?: string | null
    created_at?: Date | string
    institution: InstitutionCreateNestedOneWithoutStructuresInput
    parent?: StructureCreateNestedOneWithoutChildrenInput
    children?: StructureCreateNestedManyWithoutParentInput
  }

  export type StructureUncheckedCreateWithoutUserStructuresInput = {
    structure_id?: string
    institution_id: string
    name: string
    parent_id?: string | null
    description?: string | null
    created_at?: Date | string
    children?: StructureUncheckedCreateNestedManyWithoutParentInput
  }

  export type StructureCreateOrConnectWithoutUserStructuresInput = {
    where: StructureWhereUniqueInput
    create: XOR<StructureCreateWithoutUserStructuresInput, StructureUncheckedCreateWithoutUserStructuresInput>
  }

  export type app_userCreateWithoutUserStructuresInput = {
    user_id?: string
    username: string
    email: string
    firstname: string
    lastname: string
    role?: string
    created_at?: Date | string
    active?: boolean
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    linksFrom?: UserLinkCreateNestedManyWithoutUserFromInput
    linksTo?: UserLinkCreateNestedManyWithoutUserToInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    contentProgress?: UserContentProgressCreateNestedManyWithoutUserInput
  }

  export type app_userUncheckedCreateWithoutUserStructuresInput = {
    user_id?: string
    username: string
    email: string
    firstname: string
    lastname: string
    role?: string
    created_at?: Date | string
    active?: boolean
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    linksFrom?: UserLinkUncheckedCreateNestedManyWithoutUserFromInput
    linksTo?: UserLinkUncheckedCreateNestedManyWithoutUserToInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    contentProgress?: UserContentProgressUncheckedCreateNestedManyWithoutUserInput
  }

  export type app_userCreateOrConnectWithoutUserStructuresInput = {
    where: app_userWhereUniqueInput
    create: XOR<app_userCreateWithoutUserStructuresInput, app_userUncheckedCreateWithoutUserStructuresInput>
  }

  export type StructureUpsertWithoutUserStructuresInput = {
    update: XOR<StructureUpdateWithoutUserStructuresInput, StructureUncheckedUpdateWithoutUserStructuresInput>
    create: XOR<StructureCreateWithoutUserStructuresInput, StructureUncheckedCreateWithoutUserStructuresInput>
    where?: StructureWhereInput
  }

  export type StructureUpdateToOneWithWhereWithoutUserStructuresInput = {
    where?: StructureWhereInput
    data: XOR<StructureUpdateWithoutUserStructuresInput, StructureUncheckedUpdateWithoutUserStructuresInput>
  }

  export type StructureUpdateWithoutUserStructuresInput = {
    structure_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    institution?: InstitutionUpdateOneRequiredWithoutStructuresNestedInput
    parent?: StructureUpdateOneWithoutChildrenNestedInput
    children?: StructureUpdateManyWithoutParentNestedInput
  }

  export type StructureUncheckedUpdateWithoutUserStructuresInput = {
    structure_id?: StringFieldUpdateOperationsInput | string
    institution_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    parent_id?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: StructureUncheckedUpdateManyWithoutParentNestedInput
  }

  export type app_userUpsertWithoutUserStructuresInput = {
    update: XOR<app_userUpdateWithoutUserStructuresInput, app_userUncheckedUpdateWithoutUserStructuresInput>
    create: XOR<app_userCreateWithoutUserStructuresInput, app_userUncheckedCreateWithoutUserStructuresInput>
    where?: app_userWhereInput
  }

  export type app_userUpdateToOneWithWhereWithoutUserStructuresInput = {
    where?: app_userWhereInput
    data: XOR<app_userUpdateWithoutUserStructuresInput, app_userUncheckedUpdateWithoutUserStructuresInput>
  }

  export type app_userUpdateWithoutUserStructuresInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    linksFrom?: UserLinkUpdateManyWithoutUserFromNestedInput
    linksTo?: UserLinkUpdateManyWithoutUserToNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    contentProgress?: UserContentProgressUpdateManyWithoutUserNestedInput
  }

  export type app_userUncheckedUpdateWithoutUserStructuresInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    linksFrom?: UserLinkUncheckedUpdateManyWithoutUserFromNestedInput
    linksTo?: UserLinkUncheckedUpdateManyWithoutUserToNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    contentProgress?: UserContentProgressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type app_userCreateWithoutSessionsInput = {
    user_id?: string
    username: string
    email: string
    firstname: string
    lastname: string
    role?: string
    created_at?: Date | string
    active?: boolean
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    linksFrom?: UserLinkCreateNestedManyWithoutUserFromInput
    linksTo?: UserLinkCreateNestedManyWithoutUserToInput
    userStructures?: UserStructureCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    contentProgress?: UserContentProgressCreateNestedManyWithoutUserInput
  }

  export type app_userUncheckedCreateWithoutSessionsInput = {
    user_id?: string
    username: string
    email: string
    firstname: string
    lastname: string
    role?: string
    created_at?: Date | string
    active?: boolean
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    linksFrom?: UserLinkUncheckedCreateNestedManyWithoutUserFromInput
    linksTo?: UserLinkUncheckedCreateNestedManyWithoutUserToInput
    userStructures?: UserStructureUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    contentProgress?: UserContentProgressUncheckedCreateNestedManyWithoutUserInput
  }

  export type app_userCreateOrConnectWithoutSessionsInput = {
    where: app_userWhereUniqueInput
    create: XOR<app_userCreateWithoutSessionsInput, app_userUncheckedCreateWithoutSessionsInput>
  }

  export type app_userUpsertWithoutSessionsInput = {
    update: XOR<app_userUpdateWithoutSessionsInput, app_userUncheckedUpdateWithoutSessionsInput>
    create: XOR<app_userCreateWithoutSessionsInput, app_userUncheckedCreateWithoutSessionsInput>
    where?: app_userWhereInput
  }

  export type app_userUpdateToOneWithWhereWithoutSessionsInput = {
    where?: app_userWhereInput
    data: XOR<app_userUpdateWithoutSessionsInput, app_userUncheckedUpdateWithoutSessionsInput>
  }

  export type app_userUpdateWithoutSessionsInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    linksFrom?: UserLinkUpdateManyWithoutUserFromNestedInput
    linksTo?: UserLinkUpdateManyWithoutUserToNestedInput
    userStructures?: UserStructureUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    contentProgress?: UserContentProgressUpdateManyWithoutUserNestedInput
  }

  export type app_userUncheckedUpdateWithoutSessionsInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    linksFrom?: UserLinkUncheckedUpdateManyWithoutUserFromNestedInput
    linksTo?: UserLinkUncheckedUpdateManyWithoutUserToNestedInput
    userStructures?: UserStructureUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    contentProgress?: UserContentProgressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ArchetypeCreateWithoutDimensionInput = {
    archetype_id?: string
    name: string
    description?: string | null
  }

  export type ArchetypeUncheckedCreateWithoutDimensionInput = {
    archetype_id?: string
    name: string
    description?: string | null
  }

  export type ArchetypeCreateOrConnectWithoutDimensionInput = {
    where: ArchetypeWhereUniqueInput
    create: XOR<ArchetypeCreateWithoutDimensionInput, ArchetypeUncheckedCreateWithoutDimensionInput>
  }

  export type ArchetypeCreateManyDimensionInputEnvelope = {
    data: ArchetypeCreateManyDimensionInput | ArchetypeCreateManyDimensionInput[]
    skipDuplicates?: boolean
  }

  export type ArchetypeUpsertWithWhereUniqueWithoutDimensionInput = {
    where: ArchetypeWhereUniqueInput
    update: XOR<ArchetypeUpdateWithoutDimensionInput, ArchetypeUncheckedUpdateWithoutDimensionInput>
    create: XOR<ArchetypeCreateWithoutDimensionInput, ArchetypeUncheckedCreateWithoutDimensionInput>
  }

  export type ArchetypeUpdateWithWhereUniqueWithoutDimensionInput = {
    where: ArchetypeWhereUniqueInput
    data: XOR<ArchetypeUpdateWithoutDimensionInput, ArchetypeUncheckedUpdateWithoutDimensionInput>
  }

  export type ArchetypeUpdateManyWithWhereWithoutDimensionInput = {
    where: ArchetypeScalarWhereInput
    data: XOR<ArchetypeUpdateManyMutationInput, ArchetypeUncheckedUpdateManyWithoutDimensionInput>
  }

  export type ArchetypeScalarWhereInput = {
    AND?: ArchetypeScalarWhereInput | ArchetypeScalarWhereInput[]
    OR?: ArchetypeScalarWhereInput[]
    NOT?: ArchetypeScalarWhereInput | ArchetypeScalarWhereInput[]
    archetype_id?: UuidFilter<"Archetype"> | string
    dimension_id?: UuidNullableFilter<"Archetype"> | string | null
    name?: StringFilter<"Archetype"> | string
    description?: StringNullableFilter<"Archetype"> | string | null
  }

  export type DimensionCreateWithoutArchetypesInput = {
    dimension_id?: string
    name: string
    description?: string | null
  }

  export type DimensionUncheckedCreateWithoutArchetypesInput = {
    dimension_id?: string
    name: string
    description?: string | null
  }

  export type DimensionCreateOrConnectWithoutArchetypesInput = {
    where: DimensionWhereUniqueInput
    create: XOR<DimensionCreateWithoutArchetypesInput, DimensionUncheckedCreateWithoutArchetypesInput>
  }

  export type DimensionUpsertWithoutArchetypesInput = {
    update: XOR<DimensionUpdateWithoutArchetypesInput, DimensionUncheckedUpdateWithoutArchetypesInput>
    create: XOR<DimensionCreateWithoutArchetypesInput, DimensionUncheckedCreateWithoutArchetypesInput>
    where?: DimensionWhereInput
  }

  export type DimensionUpdateToOneWithWhereWithoutArchetypesInput = {
    where?: DimensionWhereInput
    data: XOR<DimensionUpdateWithoutArchetypesInput, DimensionUncheckedUpdateWithoutArchetypesInput>
  }

  export type DimensionUpdateWithoutArchetypesInput = {
    dimension_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DimensionUncheckedUpdateWithoutArchetypesInput = {
    dimension_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ContentCreateWithoutPrerequisitesInput = {
    content_id?: string
    title: string
    description?: string | null
    created_at?: Date | string
    prerequisite?: ContentCreateNestedOneWithoutPrerequisitesInput
    userProgress?: UserContentProgressCreateNestedManyWithoutContentInput
  }

  export type ContentUncheckedCreateWithoutPrerequisitesInput = {
    content_id?: string
    title: string
    description?: string | null
    prerequisite_id?: string | null
    created_at?: Date | string
    userProgress?: UserContentProgressUncheckedCreateNestedManyWithoutContentInput
  }

  export type ContentCreateOrConnectWithoutPrerequisitesInput = {
    where: ContentWhereUniqueInput
    create: XOR<ContentCreateWithoutPrerequisitesInput, ContentUncheckedCreateWithoutPrerequisitesInput>
  }

  export type ContentCreateWithoutPrerequisiteInput = {
    content_id?: string
    title: string
    description?: string | null
    created_at?: Date | string
    prerequisites?: ContentCreateNestedManyWithoutPrerequisiteInput
    userProgress?: UserContentProgressCreateNestedManyWithoutContentInput
  }

  export type ContentUncheckedCreateWithoutPrerequisiteInput = {
    content_id?: string
    title: string
    description?: string | null
    created_at?: Date | string
    prerequisites?: ContentUncheckedCreateNestedManyWithoutPrerequisiteInput
    userProgress?: UserContentProgressUncheckedCreateNestedManyWithoutContentInput
  }

  export type ContentCreateOrConnectWithoutPrerequisiteInput = {
    where: ContentWhereUniqueInput
    create: XOR<ContentCreateWithoutPrerequisiteInput, ContentUncheckedCreateWithoutPrerequisiteInput>
  }

  export type ContentCreateManyPrerequisiteInputEnvelope = {
    data: ContentCreateManyPrerequisiteInput | ContentCreateManyPrerequisiteInput[]
    skipDuplicates?: boolean
  }

  export type UserContentProgressCreateWithoutContentInput = {
    completed?: boolean
    progress?: number | null
    last_update?: Date | string
    user: app_userCreateNestedOneWithoutContentProgressInput
  }

  export type UserContentProgressUncheckedCreateWithoutContentInput = {
    user_id: string
    completed?: boolean
    progress?: number | null
    last_update?: Date | string
  }

  export type UserContentProgressCreateOrConnectWithoutContentInput = {
    where: UserContentProgressWhereUniqueInput
    create: XOR<UserContentProgressCreateWithoutContentInput, UserContentProgressUncheckedCreateWithoutContentInput>
  }

  export type UserContentProgressCreateManyContentInputEnvelope = {
    data: UserContentProgressCreateManyContentInput | UserContentProgressCreateManyContentInput[]
    skipDuplicates?: boolean
  }

  export type ContentUpsertWithoutPrerequisitesInput = {
    update: XOR<ContentUpdateWithoutPrerequisitesInput, ContentUncheckedUpdateWithoutPrerequisitesInput>
    create: XOR<ContentCreateWithoutPrerequisitesInput, ContentUncheckedCreateWithoutPrerequisitesInput>
    where?: ContentWhereInput
  }

  export type ContentUpdateToOneWithWhereWithoutPrerequisitesInput = {
    where?: ContentWhereInput
    data: XOR<ContentUpdateWithoutPrerequisitesInput, ContentUncheckedUpdateWithoutPrerequisitesInput>
  }

  export type ContentUpdateWithoutPrerequisitesInput = {
    content_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    prerequisite?: ContentUpdateOneWithoutPrerequisitesNestedInput
    userProgress?: UserContentProgressUpdateManyWithoutContentNestedInput
  }

  export type ContentUncheckedUpdateWithoutPrerequisitesInput = {
    content_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    prerequisite_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    userProgress?: UserContentProgressUncheckedUpdateManyWithoutContentNestedInput
  }

  export type ContentUpsertWithWhereUniqueWithoutPrerequisiteInput = {
    where: ContentWhereUniqueInput
    update: XOR<ContentUpdateWithoutPrerequisiteInput, ContentUncheckedUpdateWithoutPrerequisiteInput>
    create: XOR<ContentCreateWithoutPrerequisiteInput, ContentUncheckedCreateWithoutPrerequisiteInput>
  }

  export type ContentUpdateWithWhereUniqueWithoutPrerequisiteInput = {
    where: ContentWhereUniqueInput
    data: XOR<ContentUpdateWithoutPrerequisiteInput, ContentUncheckedUpdateWithoutPrerequisiteInput>
  }

  export type ContentUpdateManyWithWhereWithoutPrerequisiteInput = {
    where: ContentScalarWhereInput
    data: XOR<ContentUpdateManyMutationInput, ContentUncheckedUpdateManyWithoutPrerequisiteInput>
  }

  export type ContentScalarWhereInput = {
    AND?: ContentScalarWhereInput | ContentScalarWhereInput[]
    OR?: ContentScalarWhereInput[]
    NOT?: ContentScalarWhereInput | ContentScalarWhereInput[]
    content_id?: UuidFilter<"Content"> | string
    title?: StringFilter<"Content"> | string
    description?: StringNullableFilter<"Content"> | string | null
    prerequisite_id?: UuidNullableFilter<"Content"> | string | null
    created_at?: DateTimeFilter<"Content"> | Date | string
  }

  export type UserContentProgressUpsertWithWhereUniqueWithoutContentInput = {
    where: UserContentProgressWhereUniqueInput
    update: XOR<UserContentProgressUpdateWithoutContentInput, UserContentProgressUncheckedUpdateWithoutContentInput>
    create: XOR<UserContentProgressCreateWithoutContentInput, UserContentProgressUncheckedCreateWithoutContentInput>
  }

  export type UserContentProgressUpdateWithWhereUniqueWithoutContentInput = {
    where: UserContentProgressWhereUniqueInput
    data: XOR<UserContentProgressUpdateWithoutContentInput, UserContentProgressUncheckedUpdateWithoutContentInput>
  }

  export type UserContentProgressUpdateManyWithWhereWithoutContentInput = {
    where: UserContentProgressScalarWhereInput
    data: XOR<UserContentProgressUpdateManyMutationInput, UserContentProgressUncheckedUpdateManyWithoutContentInput>
  }

  export type ContentCreateWithoutUserProgressInput = {
    content_id?: string
    title: string
    description?: string | null
    created_at?: Date | string
    prerequisite?: ContentCreateNestedOneWithoutPrerequisitesInput
    prerequisites?: ContentCreateNestedManyWithoutPrerequisiteInput
  }

  export type ContentUncheckedCreateWithoutUserProgressInput = {
    content_id?: string
    title: string
    description?: string | null
    prerequisite_id?: string | null
    created_at?: Date | string
    prerequisites?: ContentUncheckedCreateNestedManyWithoutPrerequisiteInput
  }

  export type ContentCreateOrConnectWithoutUserProgressInput = {
    where: ContentWhereUniqueInput
    create: XOR<ContentCreateWithoutUserProgressInput, ContentUncheckedCreateWithoutUserProgressInput>
  }

  export type app_userCreateWithoutContentProgressInput = {
    user_id?: string
    username: string
    email: string
    firstname: string
    lastname: string
    role?: string
    created_at?: Date | string
    active?: boolean
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    linksFrom?: UserLinkCreateNestedManyWithoutUserFromInput
    linksTo?: UserLinkCreateNestedManyWithoutUserToInput
    userStructures?: UserStructureCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type app_userUncheckedCreateWithoutContentProgressInput = {
    user_id?: string
    username: string
    email: string
    firstname: string
    lastname: string
    role?: string
    created_at?: Date | string
    active?: boolean
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    linksFrom?: UserLinkUncheckedCreateNestedManyWithoutUserFromInput
    linksTo?: UserLinkUncheckedCreateNestedManyWithoutUserToInput
    userStructures?: UserStructureUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type app_userCreateOrConnectWithoutContentProgressInput = {
    where: app_userWhereUniqueInput
    create: XOR<app_userCreateWithoutContentProgressInput, app_userUncheckedCreateWithoutContentProgressInput>
  }

  export type ContentUpsertWithoutUserProgressInput = {
    update: XOR<ContentUpdateWithoutUserProgressInput, ContentUncheckedUpdateWithoutUserProgressInput>
    create: XOR<ContentCreateWithoutUserProgressInput, ContentUncheckedCreateWithoutUserProgressInput>
    where?: ContentWhereInput
  }

  export type ContentUpdateToOneWithWhereWithoutUserProgressInput = {
    where?: ContentWhereInput
    data: XOR<ContentUpdateWithoutUserProgressInput, ContentUncheckedUpdateWithoutUserProgressInput>
  }

  export type ContentUpdateWithoutUserProgressInput = {
    content_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    prerequisite?: ContentUpdateOneWithoutPrerequisitesNestedInput
    prerequisites?: ContentUpdateManyWithoutPrerequisiteNestedInput
  }

  export type ContentUncheckedUpdateWithoutUserProgressInput = {
    content_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    prerequisite_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    prerequisites?: ContentUncheckedUpdateManyWithoutPrerequisiteNestedInput
  }

  export type app_userUpsertWithoutContentProgressInput = {
    update: XOR<app_userUpdateWithoutContentProgressInput, app_userUncheckedUpdateWithoutContentProgressInput>
    create: XOR<app_userCreateWithoutContentProgressInput, app_userUncheckedCreateWithoutContentProgressInput>
    where?: app_userWhereInput
  }

  export type app_userUpdateToOneWithWhereWithoutContentProgressInput = {
    where?: app_userWhereInput
    data: XOR<app_userUpdateWithoutContentProgressInput, app_userUncheckedUpdateWithoutContentProgressInput>
  }

  export type app_userUpdateWithoutContentProgressInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    linksFrom?: UserLinkUpdateManyWithoutUserFromNestedInput
    linksTo?: UserLinkUpdateManyWithoutUserToNestedInput
    userStructures?: UserStructureUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type app_userUncheckedUpdateWithoutContentProgressInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    linksFrom?: UserLinkUncheckedUpdateManyWithoutUserFromNestedInput
    linksTo?: UserLinkUncheckedUpdateManyWithoutUserToNestedInput
    userStructures?: UserStructureUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type app_userCreateWithoutAuditLogsInput = {
    user_id?: string
    username: string
    email: string
    firstname: string
    lastname: string
    role?: string
    created_at?: Date | string
    active?: boolean
    sessions?: SessionCreateNestedManyWithoutUserInput
    linksFrom?: UserLinkCreateNestedManyWithoutUserFromInput
    linksTo?: UserLinkCreateNestedManyWithoutUserToInput
    userStructures?: UserStructureCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    contentProgress?: UserContentProgressCreateNestedManyWithoutUserInput
  }

  export type app_userUncheckedCreateWithoutAuditLogsInput = {
    user_id?: string
    username: string
    email: string
    firstname: string
    lastname: string
    role?: string
    created_at?: Date | string
    active?: boolean
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    linksFrom?: UserLinkUncheckedCreateNestedManyWithoutUserFromInput
    linksTo?: UserLinkUncheckedCreateNestedManyWithoutUserToInput
    userStructures?: UserStructureUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    contentProgress?: UserContentProgressUncheckedCreateNestedManyWithoutUserInput
  }

  export type app_userCreateOrConnectWithoutAuditLogsInput = {
    where: app_userWhereUniqueInput
    create: XOR<app_userCreateWithoutAuditLogsInput, app_userUncheckedCreateWithoutAuditLogsInput>
  }

  export type app_userUpsertWithoutAuditLogsInput = {
    update: XOR<app_userUpdateWithoutAuditLogsInput, app_userUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<app_userCreateWithoutAuditLogsInput, app_userUncheckedCreateWithoutAuditLogsInput>
    where?: app_userWhereInput
  }

  export type app_userUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: app_userWhereInput
    data: XOR<app_userUpdateWithoutAuditLogsInput, app_userUncheckedUpdateWithoutAuditLogsInput>
  }

  export type app_userUpdateWithoutAuditLogsInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    sessions?: SessionUpdateManyWithoutUserNestedInput
    linksFrom?: UserLinkUpdateManyWithoutUserFromNestedInput
    linksTo?: UserLinkUpdateManyWithoutUserToNestedInput
    userStructures?: UserStructureUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    contentProgress?: UserContentProgressUpdateManyWithoutUserNestedInput
  }

  export type app_userUncheckedUpdateWithoutAuditLogsInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    linksFrom?: UserLinkUncheckedUpdateManyWithoutUserFromNestedInput
    linksTo?: UserLinkUncheckedUpdateManyWithoutUserToNestedInput
    userStructures?: UserStructureUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    contentProgress?: UserContentProgressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type app_userCreateWithoutNotificationsInput = {
    user_id?: string
    username: string
    email: string
    firstname: string
    lastname: string
    role?: string
    created_at?: Date | string
    active?: boolean
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    linksFrom?: UserLinkCreateNestedManyWithoutUserFromInput
    linksTo?: UserLinkCreateNestedManyWithoutUserToInput
    userStructures?: UserStructureCreateNestedManyWithoutUserInput
    contentProgress?: UserContentProgressCreateNestedManyWithoutUserInput
  }

  export type app_userUncheckedCreateWithoutNotificationsInput = {
    user_id?: string
    username: string
    email: string
    firstname: string
    lastname: string
    role?: string
    created_at?: Date | string
    active?: boolean
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    linksFrom?: UserLinkUncheckedCreateNestedManyWithoutUserFromInput
    linksTo?: UserLinkUncheckedCreateNestedManyWithoutUserToInput
    userStructures?: UserStructureUncheckedCreateNestedManyWithoutUserInput
    contentProgress?: UserContentProgressUncheckedCreateNestedManyWithoutUserInput
  }

  export type app_userCreateOrConnectWithoutNotificationsInput = {
    where: app_userWhereUniqueInput
    create: XOR<app_userCreateWithoutNotificationsInput, app_userUncheckedCreateWithoutNotificationsInput>
  }

  export type app_userUpsertWithoutNotificationsInput = {
    update: XOR<app_userUpdateWithoutNotificationsInput, app_userUncheckedUpdateWithoutNotificationsInput>
    create: XOR<app_userCreateWithoutNotificationsInput, app_userUncheckedCreateWithoutNotificationsInput>
    where?: app_userWhereInput
  }

  export type app_userUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: app_userWhereInput
    data: XOR<app_userUpdateWithoutNotificationsInput, app_userUncheckedUpdateWithoutNotificationsInput>
  }

  export type app_userUpdateWithoutNotificationsInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    linksFrom?: UserLinkUpdateManyWithoutUserFromNestedInput
    linksTo?: UserLinkUpdateManyWithoutUserToNestedInput
    userStructures?: UserStructureUpdateManyWithoutUserNestedInput
    contentProgress?: UserContentProgressUpdateManyWithoutUserNestedInput
  }

  export type app_userUncheckedUpdateWithoutNotificationsInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    linksFrom?: UserLinkUncheckedUpdateManyWithoutUserFromNestedInput
    linksTo?: UserLinkUncheckedUpdateManyWithoutUserToNestedInput
    userStructures?: UserStructureUncheckedUpdateManyWithoutUserNestedInput
    contentProgress?: UserContentProgressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type StructureCreateManyInstitutionInput = {
    structure_id?: string
    name: string
    parent_id?: string | null
    description?: string | null
    created_at?: Date | string
  }

  export type StructureUpdateWithoutInstitutionInput = {
    structure_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    userStructures?: UserStructureUpdateManyWithoutStructureNestedInput
    parent?: StructureUpdateOneWithoutChildrenNestedInput
    children?: StructureUpdateManyWithoutParentNestedInput
  }

  export type StructureUncheckedUpdateWithoutInstitutionInput = {
    structure_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    parent_id?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    userStructures?: UserStructureUncheckedUpdateManyWithoutStructureNestedInput
    children?: StructureUncheckedUpdateManyWithoutParentNestedInput
  }

  export type StructureUncheckedUpdateManyWithoutInstitutionInput = {
    structure_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    parent_id?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserStructureCreateManyStructureInput = {
    user_id: string
  }

  export type StructureCreateManyParentInput = {
    structure_id?: string
    institution_id: string
    name: string
    description?: string | null
    created_at?: Date | string
  }

  export type UserStructureUpdateWithoutStructureInput = {
    user?: app_userUpdateOneRequiredWithoutUserStructuresNestedInput
  }

  export type UserStructureUncheckedUpdateWithoutStructureInput = {
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export type UserStructureUncheckedUpdateManyWithoutStructureInput = {
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export type StructureUpdateWithoutParentInput = {
    structure_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    userStructures?: UserStructureUpdateManyWithoutStructureNestedInput
    institution?: InstitutionUpdateOneRequiredWithoutStructuresNestedInput
    children?: StructureUpdateManyWithoutParentNestedInput
  }

  export type StructureUncheckedUpdateWithoutParentInput = {
    structure_id?: StringFieldUpdateOperationsInput | string
    institution_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    userStructures?: UserStructureUncheckedUpdateManyWithoutStructureNestedInput
    children?: StructureUncheckedUpdateManyWithoutParentNestedInput
  }

  export type StructureUncheckedUpdateManyWithoutParentInput = {
    structure_id?: StringFieldUpdateOperationsInput | string
    institution_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyUserInput = {
    audit_id?: string
    table_name: string
    record_id?: string | null
    timestamp?: Date | string
    details?: NullableJsonNullValueInput | InputJsonValue
  }

  export type SessionCreateManyUserInput = {
    session_id?: string
    token: string
    created_at?: Date | string
    expires_at: Date | string
  }

  export type UserLinkCreateManyUserFromInput = {
    link_id?: string
    id_user_to?: string | null
    link_type: $Enums.linkType
    created_at?: Date | string
  }

  export type UserLinkCreateManyUserToInput = {
    link_id?: string
    id_user_from?: string | null
    link_type: $Enums.linkType
    created_at?: Date | string
  }

  export type UserStructureCreateManyUserInput = {
    structure_id: string
  }

  export type NotificationCreateManyUserInput = {
    notification_id?: string
    title: string
    message?: string | null
    read?: boolean
    created_at?: Date | string
  }

  export type UserContentProgressCreateManyUserInput = {
    content_id: string
    completed?: boolean
    progress?: number | null
    last_update?: Date | string
  }

  export type AuditLogUpdateWithoutUserInput = {
    audit_id?: StringFieldUpdateOperationsInput | string
    table_name?: StringFieldUpdateOperationsInput | string
    record_id?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    details?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AuditLogUncheckedUpdateWithoutUserInput = {
    audit_id?: StringFieldUpdateOperationsInput | string
    table_name?: StringFieldUpdateOperationsInput | string
    record_id?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    details?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AuditLogUncheckedUpdateManyWithoutUserInput = {
    audit_id?: StringFieldUpdateOperationsInput | string
    table_name?: StringFieldUpdateOperationsInput | string
    record_id?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    details?: NullableJsonNullValueInput | InputJsonValue
  }

  export type SessionUpdateWithoutUserInput = {
    session_id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    session_id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    session_id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLinkUpdateWithoutUserFromInput = {
    link_id?: StringFieldUpdateOperationsInput | string
    link_type?: EnumlinkTypeFieldUpdateOperationsInput | $Enums.linkType
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    userTo?: app_userUpdateOneWithoutLinksToNestedInput
  }

  export type UserLinkUncheckedUpdateWithoutUserFromInput = {
    link_id?: StringFieldUpdateOperationsInput | string
    id_user_to?: NullableStringFieldUpdateOperationsInput | string | null
    link_type?: EnumlinkTypeFieldUpdateOperationsInput | $Enums.linkType
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLinkUncheckedUpdateManyWithoutUserFromInput = {
    link_id?: StringFieldUpdateOperationsInput | string
    id_user_to?: NullableStringFieldUpdateOperationsInput | string | null
    link_type?: EnumlinkTypeFieldUpdateOperationsInput | $Enums.linkType
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLinkUpdateWithoutUserToInput = {
    link_id?: StringFieldUpdateOperationsInput | string
    link_type?: EnumlinkTypeFieldUpdateOperationsInput | $Enums.linkType
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    userFrom?: app_userUpdateOneWithoutLinksFromNestedInput
  }

  export type UserLinkUncheckedUpdateWithoutUserToInput = {
    link_id?: StringFieldUpdateOperationsInput | string
    id_user_from?: NullableStringFieldUpdateOperationsInput | string | null
    link_type?: EnumlinkTypeFieldUpdateOperationsInput | $Enums.linkType
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLinkUncheckedUpdateManyWithoutUserToInput = {
    link_id?: StringFieldUpdateOperationsInput | string
    id_user_from?: NullableStringFieldUpdateOperationsInput | string | null
    link_type?: EnumlinkTypeFieldUpdateOperationsInput | $Enums.linkType
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserStructureUpdateWithoutUserInput = {
    structure?: StructureUpdateOneRequiredWithoutUserStructuresNestedInput
  }

  export type UserStructureUncheckedUpdateWithoutUserInput = {
    structure_id?: StringFieldUpdateOperationsInput | string
  }

  export type UserStructureUncheckedUpdateManyWithoutUserInput = {
    structure_id?: StringFieldUpdateOperationsInput | string
  }

  export type NotificationUpdateWithoutUserInput = {
    notification_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateWithoutUserInput = {
    notification_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutUserInput = {
    notification_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserContentProgressUpdateWithoutUserInput = {
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: NullableFloatFieldUpdateOperationsInput | number | null
    last_update?: DateTimeFieldUpdateOperationsInput | Date | string
    content?: ContentUpdateOneRequiredWithoutUserProgressNestedInput
  }

  export type UserContentProgressUncheckedUpdateWithoutUserInput = {
    content_id?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: NullableFloatFieldUpdateOperationsInput | number | null
    last_update?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserContentProgressUncheckedUpdateManyWithoutUserInput = {
    content_id?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: NullableFloatFieldUpdateOperationsInput | number | null
    last_update?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArchetypeCreateManyDimensionInput = {
    archetype_id?: string
    name: string
    description?: string | null
  }

  export type ArchetypeUpdateWithoutDimensionInput = {
    archetype_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ArchetypeUncheckedUpdateWithoutDimensionInput = {
    archetype_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ArchetypeUncheckedUpdateManyWithoutDimensionInput = {
    archetype_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ContentCreateManyPrerequisiteInput = {
    content_id?: string
    title: string
    description?: string | null
    created_at?: Date | string
  }

  export type UserContentProgressCreateManyContentInput = {
    user_id: string
    completed?: boolean
    progress?: number | null
    last_update?: Date | string
  }

  export type ContentUpdateWithoutPrerequisiteInput = {
    content_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    prerequisites?: ContentUpdateManyWithoutPrerequisiteNestedInput
    userProgress?: UserContentProgressUpdateManyWithoutContentNestedInput
  }

  export type ContentUncheckedUpdateWithoutPrerequisiteInput = {
    content_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    prerequisites?: ContentUncheckedUpdateManyWithoutPrerequisiteNestedInput
    userProgress?: UserContentProgressUncheckedUpdateManyWithoutContentNestedInput
  }

  export type ContentUncheckedUpdateManyWithoutPrerequisiteInput = {
    content_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserContentProgressUpdateWithoutContentInput = {
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: NullableFloatFieldUpdateOperationsInput | number | null
    last_update?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: app_userUpdateOneRequiredWithoutContentProgressNestedInput
  }

  export type UserContentProgressUncheckedUpdateWithoutContentInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: NullableFloatFieldUpdateOperationsInput | number | null
    last_update?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserContentProgressUncheckedUpdateManyWithoutContentInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: NullableFloatFieldUpdateOperationsInput | number | null
    last_update?: DateTimeFieldUpdateOperationsInput | Date | string
  }



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