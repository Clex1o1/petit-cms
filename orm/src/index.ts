import {
  AnyEntity,
  Connection,
  DatabaseDriver,
  EntityData,
  EntityMetadata,
  EntityProperty,
  FilterQuery,
  IPrimaryKey,
  NamingStrategy,
  Platform,
  QueryOrder,
  QueryResult,
} from "@mikro-orm/core";

// export class USDriver extends Platform {
//   protected abstract schemaHelper: MyCustomSchemaHelper;

//   // here you can override default settings
//   usesPivotTable(): boolean;
//   supportsTransactions(): boolean;
//   supportsSavePoints(): boolean;
//   getNamingStrategy(): { new (): NamingStrategy };
//   getIdentifierQuoteCharacter(): string;
//   getParameterPlaceholder(index?: number): string;
//   usesReturningStatement(): boolean;
//   normalizePrimaryKey<T = number | string>(data: IPrimaryKey): T;
//   denormalizePrimaryKey(data: IPrimaryKey): IPrimaryKey;
//   getSerializedPrimaryKeyField(field: string): string;
// }

export class USConnection extends Connection {
  // implement abstract methods
  connect(): Promise<void>;
  isConnected(): Promise<boolean>;
  close(force?: boolean): Promise<void>;
  getDefaultClientUrl(): string;
  execute(
    query: string,
    params?: any[],
    method?: "all" | "get" | "run"
  ): Promise<QueryResult | any | any[]>;
}

export class USSchemaHelper extends DatabaseDriver {
  // initialize connection and platform
  protected readonly connection = new MyCustomConnection(this.config);
  protected readonly platform = new MyCustomPlatform();

  // and implement abstract methods
  find<T extends AnyEntity>(
    entityName: string,
    where: FilterQuery<T>,
    populate?: string[],
    orderBy?: Record<string, QueryOrder>,
    limit?: number,
    offset?: number
  ): Promise<T[]>;
  findOne<T extends AnyEntity>(
    entityName: string,
    where: FilterQuery<T> | string,
    populate: string[]
  ): Promise<T | null>;
  nativeInsert<T extends AnyEntityType<T>>(
    entityName: string,
    data: EntityData<T>
  ): Promise<QueryResult>;
  nativeUpdate<T extends AnyEntity>(
    entityName: string,
    where: FilterQuery<T> | IPrimaryKey,
    data: EntityData<T>
  ): Promise<QueryResult>;
  nativeDelete<T extends AnyEntity>(
    entityName: string,
    where: FilterQuery<T> | IPrimaryKey
  ): Promise<QueryResult>;
  count<T extends AnyEntity>(
    entityName: string,
    where: FilterQuery<T>
  ): Promise<number>;
}
