import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import SearchBar from "../component/search/SearchBar";
import { getFlights } from "../services/api";



const Container = styled.main`
  max-width: 720px;
  margin: 48px auto;
  padding: 0 20px 60px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 12px;
`;

const ErrorMessage = styled.p`
  margin: 8px 0 0;
  color: #d64545;
  font-size: 0.95rem;
`;

export default function HomePage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState({
    from: "",
    to: "",
    date: "",
  });

  const [searchOptions, setSearchOptions] = useState({ origins: [], destinations: [] });
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadOptions = async () => {
      setIsLoadingOptions(true);
      try {
        const response = await getFlights();
        if (!isMounted) return;

        const origins = new Set();
        const destinations = new Set();

        response.data.forEach((flight) => {
          if (flight?.from) origins.add(flight.from.trim());
          if (flight?.to) destinations.add(flight.to.trim());
        });

        setSearchOptions({
          origins: Array.from(origins).sort((a, b) => a.localeCompare(b)),
          destinations: Array.from(destinations).sort((a, b) => a.localeCompare(b)),
        });
        setOptionsError(null);
      } catch (error) {
        if (!isMounted) return;
        setOptionsError("Failed to load airports. Please refresh and try again.");
        setSearchOptions({ origins: [], destinations: [] });
      } finally {
        if (isMounted) {
          setIsLoadingOptions(false);
        }
      }
    };

    loadOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleQueryChange = (partial) => {
    setQuery((prev) => ({ ...prev, ...partial }));
  };

  const handleSearch = ({ from, to, date }) => {
    const params = new URLSearchParams({
      from,
      to,
      date,
    });

    navigate(`/flights?${params.toString()}`);
  };

  return (
    <Container>
      <Title>Find your flight</Title>
      <SearchBar
        value={query}
        onChange={handleQueryChange}
        onSearch={handleSearch}
        options={searchOptions}
        isLoadingOptions={isLoadingOptions}
      />
      {optionsError && <ErrorMessage>{optionsError}</ErrorMessage>}    </Container>
  );
}

