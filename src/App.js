import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate,
} from "react-router-dom";
import axios from "axios";

const Tabs = ({ tabs }) => (
  <ul>
    {tabs.map((tab) => (
      <li key={tab.id}>
        <Link to={`/${tab.id}`}>{tab.title}</Link>
      </li>
    ))}
  </ul>
);

const App = () => {
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("tabs.json").then((response) => {
      setTabs(response.data);
      setLoading(false);
    });
  }, []);

  const defaultTabId = window.location.pathname.replace("/", "");
  const initialTab = tabs.find((tab) => tab.id === defaultTabId);
  const defaultTab = initialTab || tabs[0];

  const sortedTabs = [...tabs].sort((a, b) => a.order - b.order);

  return (
    <Router>
      <div>
        <h1>My first CMS</h1>
        {loading ? (
          <p>Loading tabs...</p>
        ) : (
          <>
            <Tabs tabs={sortedTabs} />
            <Routes>
              {sortedTabs.map((tab) => (
                <Route
                  key={tab.id}
                  path={`/${tab.id}`}
                  element={<ComponentLoader path={tab.path} />}
                />
              ))}
              <Route path="/" element={<Navigate to={`/${defaultTab.id}`} />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
};

const ComponentLoader = ({ path }) => {
  const Component = require(`./${path}`).default;

  return <Component />;
};

export default App;
