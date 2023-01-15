import { Addresses, Raffle__factory } from '@0xtarc/example-sdk';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { BigNumberish, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork, useProvider, useSigner } from 'wagmi';
import { goerli } from 'wagmi/chains';

function App() {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const provider = useProvider();
  const chainId = chain?.id ?? goerli.id;
  const RaffleAddress = Addresses[chainId].Raffle;
  const Raffle = Raffle__factory.connect(RaffleAddress, signer ?? provider);

  // Get and set entrance fee
  const [entranceFee, setEntranceFee] = useState<BigNumberish>('0');
  useEffect(() => {
    // Get entrance fee
    (async () => {
      const entranceFee = await Raffle.getEntranceFee();
      setEntranceFee(entranceFee);
    })();
  });

  const enterRaffle = () => {
    Raffle.enterRaffle({
      value: entranceFee,
    });
  };

  const RaffleEnter = () => {
    Raffle.on(Raffle.filters.RaffleEnter(), (entrant) => {
      console.log('New entrant: ', entrant);
    });
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: 12,
        }}
      >
        <ConnectButton />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          marginTop: '33vh',
        }}
      >
        <div>
          <p
            style={{
              fontSize: '24px',
            }}
          >
            Entrance fee: {ethers.utils.formatEther(entranceFee).toString()}{' '}
            $ETH
          </p>
        </div>
        <button
          style={{
            width: '420px',
            cursor: 'pointer',
            marginLeft: '2.5rem',
            fontSize: '24px',
          }}
          onClick={enterRaffle}
        >
          Enter Raffle
        </button>
      </div>
    </>
  );
}

export default App;
