import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CoinProps } from '../home'
import styles from './detail.module.css'

interface ResponseData {
  data: CoinProps
}

interface ErrorData {
  error: string
}

type DataProps = ResponseData | ErrorData

export function Detail() {
  const { cripto } = useParams()
  const navigate = useNavigate()

  const [coin, setCoin] = useState<CoinProps>()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getCoin() {
      try {
        fetch(`https://api.coincap.io/v2/assets/${cripto}`)
          .then((response) => response.json())
          .then((data: DataProps) => {
            if ('error' in data) {
              navigate('/')
              return
            }
            const price = Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            })
            const priceCompact = Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              notation: 'compact',
            })

            const resultData = {
              ...data.data,
              formatedPrice: price.format(Number(data.data.priceUsd)),
              formatedMarketCap: priceCompact.format(
                Number(data.data.marketCapUsd),
              ),
              formatedVolume: priceCompact.format(
                Number(data.data.volumeUsd24Hr),
              ),
            }

            setCoin(resultData)
            setLoading(false)
          })
      } catch (error) {
        console.log(error)
        navigate('/')
      }
    }

    getCoin()
  }, [cripto])

  if (loading || !coin) {
    return (
      <div className={styles.container}>
        <h4 className={styles.center}>Carregando detalhes...</h4>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.center}>{coin?.name}</h1>
      <h3 className={styles.center}>{coin?.symbol}</h3>
      <section className={styles.content}>
        <img
          src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`}
          alt="Icone da criptomoeda"
          className={styles.logo}
        />
        <h3>
          {coin?.name} | {coin?.symbol}
        </h3>

        <p>
          <strong>Preço:</strong> {coin?.formatedPrice}
        </p>
        <a>
          <strong>Mercado:</strong> {coin?.formatedMarketCap}
        </a>
        <a>
          <strong>Volume:</strong> {coin?.formatedVolume}
        </a>
        <a>
          <strong>Mudança 24h: </strong>
          <span
            className={
              Number(coin?.changePercent24Hr) > 0 ? styles.profit : styles.loss
            }
          >
            {Number(coin?.changePercent24Hr).toFixed(3)}
          </span>
        </a>
      </section>
    </div>
  )
}
