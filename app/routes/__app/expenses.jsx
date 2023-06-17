import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { FaPlus, FaDownload } from "react-icons/fa";

import ExpensesList from "~/components/expenses/ExpensesList";
import { requireUserSession } from "../../data/auth.server";
import { getExpenses } from "../../data/expenses.server";

export default function ExpensesLayout() {
  const expenses = useLoaderData();

  const hasExpenses = !!expenses?.length;

  return (
    <>
      <Outlet />
      <main>
        <section id="expenses-actions">
          <Link to="add">
            <FaPlus />
            <span>Add Expense</span>
          </Link>
          <a href="/expenses/raw">
            <FaDownload />
            <span>Load Raw Data</span>
          </a>
        </section>
        {hasExpenses && <ExpensesList expenses={expenses} />}
        {!hasExpenses && (
          <section id="no-expenses">
            <h1>No expenses found</h1>
            <p>
              Start <Link to="add">adding some</Link>
            </p>{" "}
            today.
          </section>
        )}
      </main>
    </>
  );
}

export async function loader({ request }) {
  const userId = await requireUserSession(request);

  const expenses = await getExpenses(userId);
  return json(expenses, {
    headers: {
      'Cache-control': 'max-age=3'
    }
  });
  // if (!expenses?.length) {
  //   throw json(
  //     { message: "Could not find any expenses" },
  //     { status: 404, statusText: "No expenses found" }
  //   );
  // }
}

export function headers({ actionHeader, loaderHeaders, parentHeaders }) {
  return {
    'Cache-Control': loaderHeaders.get('Cache-Control')
  }
}

export function CatchBoundary() {
  return <p>Error</p>;
}
