CREATE TABLE "transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"ammount" integer NOT NULL,
	"date" timestamp NOT NULL,
	"payee" text NOT NULL,
	"notes" text,
	"account_id" text NOT NULL,
	"category_id" text
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE set null ON UPDATE no action;