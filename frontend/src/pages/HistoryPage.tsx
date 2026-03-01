import React, { useState, useEffect } from "react";
import { getExpenses, createExpense, createCategory, getCategories } from "../services/api";
import { Category, CategoryFormData, Expense, ExpenseFormData } from "../types";
import YearNavigation from "../components/YearNavigation";
import { MonthNavigation } from "../components/MonthNavigation";
import CategoryBreakdown from "../components/CategoryBreakdown";
import { CalendarExpenseTable } from "../components/CalendarExpenseTable";
import { ExpenseForm } from "../components/ExpenseForm";
import { CategoryForm } from "../components/CategoryForm";
import { Modal, Button } from "../vibes";
import { COLORS } from "../constants/colors";

const HistoryPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isManageDropdownOpen, setisManageDropdownOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);

  // Get year and month from URL params, default to current date if not provided
  const getInitialYearMonth = () => {
    const params = new URLSearchParams(window.location.search);
    const currentDate = new Date();
    const yearParam = params.get("year");
    const monthParam = params.get("month");

    return {
      year: yearParam ? parseInt(yearParam) : currentDate.getFullYear(),
      month: monthParam ? parseInt(monthParam) : currentDate.getMonth() + 1,
    };
  };

  const initial = getInitialYearMonth();
  const [selectedYear, setSelectedYear] = useState(initial.year);
  const [selectedMonth, setSelectedMonth] = useState(initial.month);

  // Update URL when year or month changes
  const updateURL = (year: number, month: number) => {
    const params = new URLSearchParams();
    params.set("year", year.toString());
    params.set("month", month.toString());
    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newURL);
  };

  // Initialize URL params if not present
  useEffect(() => {
    updateURL(selectedYear, selectedMonth);
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [selectedYear, selectedMonth]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await getExpenses(selectedYear, selectedMonth);
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories()
      setExpenseCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    updateURL(year, selectedMonth);
  };

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    updateURL(selectedYear, month);
  };

  const handleAddExpense = async (data: ExpenseFormData) => {
    try {
      await createExpense(data);
      setIsModalOpen(false);
      fetchExpenses();
    } catch (error) {
      console.error("Error creating expense:", error);
      throw error;
    }
  };

  const handleAddCategory = async (data: CategoryFormData) => {
    try {
      await createCategory(data);
      setIsCategoryModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  };

  // Calculate category breakdown
  const categoryData = expenses.reduce(
    (acc, expense) => {
      const category = expense.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = { category, amount: 0, count: 0 };
      }
      acc[category].amount += Number(expense.amount);
      acc[category].count += 1;
      return acc;
    },
    {} as Record<string, { category: string; amount: number; count: number }>,
  );

  const categories = Object.values(categoryData).sort(
    (a, b) => b.amount - a.amount,
  );
  const total = categories.reduce((sum, cat) => sum + cat.amount, 0);
  const totalCount = categories.reduce((sum, cat) => sum + cat.count, 0);

  const pageStyle: React.CSSProperties = {
    padding: "48px 64px",
    minHeight: "100vh",
    background: COLORS.secondary.s01,
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    justifyContent: "space-between",
  };

  const leftHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "40px",
    fontWeight: 700,
    color: COLORS.secondary.s10,
    margin: 0,
    flexShrink: 0,
  };

  const loadingStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "48px",
    fontSize: "18px",
    color: COLORS.secondary.s08,
  };

  const dropdownWrapStyle: React.CSSProperties = {
    position: "relative",
  };

  const dropdownMenuStyle: React.CSSProperties = {
    position: "absolute",
    right: 0,
    top: "calc(100% + 8px)",
    width: "220px",
    background: "white",
    border: `1px solid ${COLORS.secondary.s04}`,
    borderRadius: "12px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
    overflow: "hidden",
    zIndex: 1000,
  };

  const dropdownItemStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    background: "transparent",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    color: COLORS.secondary.s10,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const rightHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div style={leftHeaderStyle}>
          <h1 style={titleStyle}>Expense History</h1>
          <YearNavigation
            currentYear={selectedYear}
            onYearChange={handleYearChange}
          />
        </div>

        <div style={rightHeaderStyle}>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Add Expense
          </Button>

          <div style={dropdownWrapStyle}>
            <Button variant="secondary" onClick={() => setisManageDropdownOpen((v) => !v)}>
                Manage ▾
            </Button>

            {isManageDropdownOpen && (
              <>
                <div
                  onClick={() => setisManageDropdownOpen(false)}
                  style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 999,
                    background: "transparent",
                  }}
                />
                <div style={dropdownMenuStyle}>
                  <button
                    type="button"
                    style={dropdownItemStyle}
                    onClick={() => {
                      setisManageDropdownOpen(false);
                      setIsCategoryModalOpen(true);
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>＋</span>
                    Add Category
                  </button>
                </div>
              </>
              )}
          </div>
        </div>
      </div>

      <MonthNavigation
        currentMonth={selectedMonth}
        currentYear={selectedYear}
        onMonthChange={handleMonthChange}
      />

      <div>
        {loading ? (
          <div style={loadingStyle}>Loading...</div>
        ) : (
          <>
            <CategoryBreakdown
              categories={categories}
              total={total}
              totalCount={totalCount}
            />
            <div style={{ marginTop: "32px" }}>
              <CalendarExpenseTable
                categories={expenseCategories}
                expenses={expenses}
                onExpenseUpdated={fetchExpenses}
              />
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Expense"
      >
        <ExpenseForm
          categories={expenseCategories}
          onSubmit={handleAddExpense}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

       <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Add Category"
      >
        <CategoryForm
          onSubmit={handleAddCategory}
          onCancel={() => setIsCategoryModalOpen(false)}
          submitLabel="Create Category"
        />
      </Modal>
    </div>
  );
};

export default HistoryPage;
