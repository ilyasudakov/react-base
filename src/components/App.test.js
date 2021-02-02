import React from "react";
import { render } from "@testing-library/react";
import App from "./App.jsx";

describe("App component", () => {
  test("renders", () => {
    const { getByText } = render(<App />);
    expect(getByText("App")).toBeInTheDocument();
  });
});
