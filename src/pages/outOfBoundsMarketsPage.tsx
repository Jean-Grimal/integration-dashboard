import React, { useEffect, useState } from "react";
import OutOfBoundsMarketBubble from "../components/OutOfBoundsMarketBubble";
import { OutOfBoundsMarket } from "../utils/types";
import { getOutOfBoundsMarkets } from "../core/outOfBoundsMarkets";
import { getNetworkId } from "../utils/utils";
import {
  FilterInput,
  HeaderWrapper,
  MarketsWrapper,
  PageWrapper,
} from "./wrappers";

type OutOfBoundsMarketsPageProps = {
  network: "ethereum" | "base";
};

const OutOfBoundsMarketsPage: React.FC<OutOfBoundsMarketsPageProps> = ({
  network,
}) => {
  const [markets, setMarkets] = useState<OutOfBoundsMarket[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    const loadMarkets = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getOutOfBoundsMarkets(getNetworkId(network));
        setMarkets(data);
      } catch (err) {
        setError("Failed to fetch markets");
      } finally {
        setLoading(false);
      }
    };

    loadMarkets();
  }, [network]);

  const filteredMarkets = markets.filter(
    (market) =>
      market.loanAsset.symbol.toLowerCase().includes(filter.toLowerCase()) ||
      market.collateralAsset.symbol.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <PageWrapper>
      <HeaderWrapper>
        <h1 style={{ color: "white" }}>Out of Range Markets</h1>
        <FilterInput
          type="text"
          placeholder="Filter by asset symbol..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </HeaderWrapper>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <MarketsWrapper>
        {filteredMarkets.map((market) => (
          <OutOfBoundsMarketBubble key={market.id} market={market} />
        ))}
      </MarketsWrapper>
    </PageWrapper>
  );
};

export default OutOfBoundsMarketsPage;
