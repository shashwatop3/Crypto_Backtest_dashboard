// src/schema.ts
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { pgTable, integer, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema} from 'drizzle-zod';
import { set, z } from 'zod';


export const accounts = pgTable('accounts', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  email: text('email'),
  userId: text('user_id').notNull(),
});

export const accountRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
}));
export const insertAccountSchema = createInsertSchema(accounts);

export const categories = pgTable('category', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  email: text('email'),
  userId: text('user_id').notNull(),
});

export const categoryRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));
export const insertCategorySchema = createInsertSchema(categories);


export const transactions = pgTable('transactions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  ammount : integer('ammount').notNull(),
  date: timestamp('date').notNull(),
  payee: text('payee').notNull(),
  notes: text('notes'),
  accountId: text('account_id').references(() => accounts.id, {
    onDelete: 'cascade',
  }).notNull(),
  categoryId: text('category_id').references(() => categories.id, {
    onDelete: "set null",
})
});

export const transactionRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

export const insertTransactionSchema = createInsertSchema(transactions, {
  date: z.coerce.date(),
});
// // Define the "user" table
// export const user = pgTable("user", {
//   id: integer().primaryKey().generatedAlwaysAsIdentity(),
//   name: varchar({ length: 255 }).notNull(),
//   email: varchar({ length: 255 }).notNull(),
// });

// // Define the "mutual_fund" table within the "mutual_fund" schema
// export const mutualFund = pgTable("mutual_fund.mutual_fund", {
//   symbol: varchar({ length: 10 }).notNull().primaryKey(),
//   mkPrice: integer().notNull(),
//   name: varchar({ length: 255 }).notNull(),
//   category: varchar({ length: 255 }).notNull(),
// });

// // Define the "user_portfolio" table
// export const userPortfolio = pgTable("user_portfolio", {
//   id: integer().primaryKey().generatedAlwaysAsIdentity(),
//   userId: integer().notNull().references(() => user.id),
//   portfolioName: varchar({ length: 255 }).notNull(),
// });

// // Define the "user_portfolio_mutual_funds" join table
// export const userPortfolioMutualFunds = pgTable("user_portfolio_mutual_funds", {
//   userPortfolioId: integer().notNull().references(() => userPortfolio.id),
//   mutualFundSymbol: varchar({ length: 10 }).notNull().references(() => mutualFund.symbol),
//   cost: integer().notNull(),
//   units: integer().notNull(),
// });

// // Define relations
// export const userRelations = relations(user, ({ many }) => ({
//   portfolios: many(userPortfolio),
// }));

// export const userPortfolioRelations = relations(userPortfolio, ({ one }) => ({
//   mutualFunds: one(userPortfolioMutualFunds),
// }));

// export const userPortfolioMutualFundsRelations = relations(userPortfolioMutualFunds, ({ one }) => ({
//   mutualFund: one(mutualFund, {
//     fields: [userPortfolioMutualFunds.mutual_fund_symbol],
//     references: [mutualFund.symbol],
//   }),
//   portfolio: one(userPortfolio, {
//     fields: [userPortfolioMutualFunds.user_portfolio_id],
//     references: [userPortfolio.id],
//   }),
// }));