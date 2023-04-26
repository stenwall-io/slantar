import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type Account = {
  __typename?: 'Account';
  id?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  owners: Array<User>;
};

export type AccountRow = {
  __typename?: 'AccountRow';
  account: Account;
  amount: Scalars['Float'];
  amountf?: Maybe<Scalars['String']>;
  date: Scalars['Date'];
  datef?: Maybe<Scalars['String']>;
  desc: Scalars['String'];
  id?: Maybe<Scalars['String']>;
  month: Month;
  savings: Scalars['Boolean'];
  subrows?: Maybe<Array<Maybe<SubRow>>>;
  text: Scalars['String'];
};

export type Category = {
  __typename?: 'Category';
  group: Scalars['String'];
  id?: Maybe<Scalars['String']>;
  subgroup: Scalars['String'];
};

export type Month = {
  __typename?: 'Month';
  accountrows?: Maybe<Array<Maybe<AccountRow>>>;
  id?: Maybe<Scalars['String']>;
  month: Scalars['Int'];
  name: Scalars['String'];
  year: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAccount: Account;
  createAccountRow: AccountRow;
  createSubRow?: Maybe<SubRow>;
  deleteAccountRow?: Maybe<Scalars['ID']>;
  setAccountRowMonth?: Maybe<AccountRow>;
  updateAccountRow?: Maybe<AccountRow>;
  updateSubRow?: Maybe<SubRow>;
};


export type MutationCreateAccountArgs = {
  name: Scalars['String'];
  ownerId: Scalars['ID'];
};


export type MutationCreateAccountRowArgs = {
  accountId: Scalars['ID'];
  amount: Scalars['Float'];
  date: Scalars['Date'];
  month: Scalars['Int'];
  text: Scalars['String'];
  year: Scalars['Int'];
};


export type MutationCreateSubRowArgs = {
  accountRowId: Scalars['ID'];
  amount: Scalars['Float'];
};


export type MutationDeleteAccountRowArgs = {
  id: Scalars['ID'];
};


export type MutationSetAccountRowMonthArgs = {
  accountRowId: Scalars['ID'];
  monthId: Scalars['ID'];
};


export type MutationUpdateAccountRowArgs = {
  accountRowId: Scalars['ID'];
  desc: Scalars['String'];
  monthId: Scalars['ID'];
  savings: Scalars['Boolean'];
};


export type MutationUpdateSubRowArgs = {
  amount: Scalars['Float'];
  categoryId: Scalars['ID'];
  extra: Scalars['Boolean'];
  subRowId: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  account?: Maybe<Account>;
  accountRows?: Maybe<Array<Maybe<AccountRow>>>;
  accounts?: Maybe<Array<Maybe<Account>>>;
  categories?: Maybe<Array<Maybe<Category>>>;
  info?: Maybe<Scalars['String']>;
  month?: Maybe<Month>;
  months?: Maybe<Array<Maybe<Month>>>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryAccountArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryAccountRowsArgs = {
  accountId?: InputMaybe<Scalars['ID']>;
};


export type QueryMonthArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryUserArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type SubRow = {
  __typename?: 'SubRow';
  amount: Scalars['Float'];
  amountf: Scalars['String'];
  category?: Maybe<Category>;
  extra: Scalars['Boolean'];
  id?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  name: Scalars['String'];
  username: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Account: ResolverTypeWrapper<Account>;
  AccountRow: ResolverTypeWrapper<AccountRow>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Category: ResolverTypeWrapper<Category>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Month: ResolverTypeWrapper<Month>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  SubRow: ResolverTypeWrapper<SubRow>;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Account: Account;
  AccountRow: AccountRow;
  Boolean: Scalars['Boolean'];
  Category: Category;
  Date: Scalars['Date'];
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Month: Month;
  Mutation: {};
  Query: {};
  String: Scalars['String'];
  SubRow: SubRow;
  User: User;
};

export type AccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['Account'] = ResolversParentTypes['Account']> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owners?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AccountRowResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountRow'] = ResolversParentTypes['AccountRow']> = {
  account?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  amountf?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  datef?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  desc?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  month?: Resolver<ResolversTypes['Month'], ParentType, ContextType>;
  savings?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  subrows?: Resolver<Maybe<Array<Maybe<ResolversTypes['SubRow']>>>, ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = {
  group?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subgroup?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type MonthResolvers<ContextType = any, ParentType extends ResolversParentTypes['Month'] = ResolversParentTypes['Month']> = {
  accountrows?: Resolver<Maybe<Array<Maybe<ResolversTypes['AccountRow']>>>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  month?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  year?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createAccount?: Resolver<ResolversTypes['Account'], ParentType, ContextType, RequireFields<MutationCreateAccountArgs, 'name' | 'ownerId'>>;
  createAccountRow?: Resolver<ResolversTypes['AccountRow'], ParentType, ContextType, RequireFields<MutationCreateAccountRowArgs, 'accountId' | 'amount' | 'date' | 'month' | 'text' | 'year'>>;
  createSubRow?: Resolver<Maybe<ResolversTypes['SubRow']>, ParentType, ContextType, RequireFields<MutationCreateSubRowArgs, 'accountRowId' | 'amount'>>;
  deleteAccountRow?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType, RequireFields<MutationDeleteAccountRowArgs, 'id'>>;
  setAccountRowMonth?: Resolver<Maybe<ResolversTypes['AccountRow']>, ParentType, ContextType, RequireFields<MutationSetAccountRowMonthArgs, 'accountRowId' | 'monthId'>>;
  updateAccountRow?: Resolver<Maybe<ResolversTypes['AccountRow']>, ParentType, ContextType, RequireFields<MutationUpdateAccountRowArgs, 'accountRowId' | 'desc' | 'monthId' | 'savings'>>;
  updateSubRow?: Resolver<Maybe<ResolversTypes['SubRow']>, ParentType, ContextType, RequireFields<MutationUpdateSubRowArgs, 'amount' | 'categoryId' | 'extra' | 'subRowId'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  account?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType, Partial<QueryAccountArgs>>;
  accountRows?: Resolver<Maybe<Array<Maybe<ResolversTypes['AccountRow']>>>, ParentType, ContextType, Partial<QueryAccountRowsArgs>>;
  accounts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Account']>>>, ParentType, ContextType>;
  categories?: Resolver<Maybe<Array<Maybe<ResolversTypes['Category']>>>, ParentType, ContextType>;
  info?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  month?: Resolver<Maybe<ResolversTypes['Month']>, ParentType, ContextType, Partial<QueryMonthArgs>>;
  months?: Resolver<Maybe<Array<Maybe<ResolversTypes['Month']>>>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, Partial<QueryUserArgs>>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
};

export type SubRowResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubRow'] = ResolversParentTypes['SubRow']> = {
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  amountf?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>;
  extra?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Account?: AccountResolvers<ContextType>;
  AccountRow?: AccountRowResolvers<ContextType>;
  Category?: CategoryResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Month?: MonthResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SubRow?: SubRowResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

