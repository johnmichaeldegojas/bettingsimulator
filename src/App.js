import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {

  const numberName = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'];
  const [isEnabledCard, setIsEnabledCard] = useState([true,false,false,false,false,false,false,false])
  const [initialTether, setInitialTether] = useState(300)
  const [tetherInput, setTetherInput] = useState(0)
  const [currentRemaining, setCurrentRemaining] = useState(0)
  const [totalLossGainValue, settotalLossGainValue] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  let setEnabledStep = (index) => {
    setIsEnabledCard(
      isEnabledCard.map((data, i )=> {
        if(i === index) return true;
        else return false
      })
    )
    setCurrentStep(index)
  }

  useEffect(() => {
    const dataFromStorage = localStorage.getItem('lastInsertedBetValue');
    const lastInsertedLS = dataFromStorage ? parseFloat(dataFromStorage): 300;
    setInitialTether(lastInsertedLS);
  }, [])

  let roundUp =(num, precision) => {
    precision = Math.pow(10, precision)
    return Math.ceil(num * precision) / precision
  }

  const startBetting = (e) => {
    e.preventDefault();
    setEnabledStep(1);
    setTetherInput(initialTether)
    setCurrentRemaining(initialTether)

    localStorage.setItem('lastInsertedBetValue', initialTether.toFixed(4));
  }

  const initiateLose = (e) => {
    e.preventDefault();
    setEnabledStep(currentStep+1)
    setCurrentRemaining(currentRemaining - (getBetAmount(currentStep, false)))
    settotalLossGainValue((totalLossGainValue - getBetAmount(currentStep, false)))
  }

  const initiateWin = (e) => {
    e.preventDefault();
    setEnabledStep(1);
    let winAmount =  (getWinAmount(currentStep,false) - getBetAmount(currentStep,false));
    let currentRemain = currentRemaining + winAmount;
    setCurrentRemaining(currentRemain);
    settotalLossGainValue(currentRemain - tetherInput);

    setInitialTether(parseFloat(currentRemain.toFixed(4)))

    localStorage.setItem('lastInsertedBetValue', currentRemain.toFixed(4));
  }

  const resetBetting = (e) => {
    e.preventDefault();
    setEnabledStep(0)
    setCurrentRemaining(0)
    settotalLossGainValue(0)
    setTetherInput(0)

    localStorage.setItem('lastInsertedBetValue', initialTether.toFixed(4));
  }

  const setInitialTetherAmount = (value) => {
    value = parseFloat(value? value : 0)
    setInitialTether(value)
  }

  const percentStep = [0, 0.6, 1.2, 2.6, 5.6, 12, 25, 53]

  let getBetAmount = (stepNo, getFixed = true) =>{
    let betAmount = (((initialTether ? initialTether: 0)/100) * percentStep[stepNo]);

    if(getFixed) return betAmount.toFixed(4);

    return parseFloat(betAmount.toFixed(4));
  }

  let getWinAmount = (stepNo, getFixed = true) =>{
    let betAmount = getBetAmount(stepNo, false) * 1.95;
    if(getFixed) return betAmount.toFixed(4);
    return parseFloat(betAmount.toFixed(4));
  }

  let getNetProfit = (stepNo, getFixed = true) =>{
    let netProfit = 0;
    if(stepNo === 1)
      netProfit = (getWinAmount(stepNo, false)) -  getBetAmount(stepNo, false);
    else {
      let totalLoss = 0;
      for(let x = 1; x <= stepNo; x++){
        totalLoss += (getBetAmount(x, false));
      }
      netProfit = (getWinAmount(stepNo, false)) -  totalLoss;
    }
    if(getFixed) return netProfit.toFixed(4);

    return parseFloat(netProfit.toFixed(4));
  }

  return (
    <>
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
        <div>
          <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
            BETTING GUIDE
          </p>
        </div>
        <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
          <span className="relative inline-block">
            <svg
              viewBox="0 0 52 24"
              fill="currentColor"
              className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
            >
              <defs>
                <pattern
                  id="d0d83814-78b6-480f-9a5f-7f637616b267"
                  x="0"
                  y="0"
                  width=".135"
                  height=".30"
                >
                  <circle cx="1" cy="1" r=".7" />
                </pattern>
              </defs>
              <rect
                fill="url(#d0d83814-78b6-480f-9a5f-7f637616b267)"
                width="52"
                height="24"
              />
            </svg>
            <span className="relative">Guide</span>
          </span>{' '}
          para hindi na mag excel
        </h2>
        <p className="text-base text-gray-700 md:text-lg">
          Bali ienter mo lang yung current tether asset mo sa start position tas click mo start betting now.
        </p>
      </div>
      <div className="relative grid gap-8 row-gap-5 mb-8 md:row-gap-8 lg:grid-cols-4 sm:grid-cols-2">
        <div className="absolute inset-0 flex items-center justify-center sm:hidden lg:flex">
          <div className="w-px h-full bg-gray-300 lg:w-full lg:h-px" />
        </div>
        <div className={`${!isEnabledCard[0] ? 'disabled ': ''}p-5 duration-300 transform bg-white shadow-sm hover:-translate-y-2  border-2 rounded shadow-sm border-deep-purple-accent-700 `}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-lg font-bold leading-5">Enter Tether Amount $:</p>
            
          </div>
          <p className="text-sm text-gray-900">
          <input type='number'  
                  step="any"
            onChange={e => setInitialTetherAmount(e.currentTarget.value)}
            value={initialTether}
          className="flex items-center h-12 px-4 w-max bg-gray-100 mt-2 rounded focus:outline-none focus:ring-2" type="text"/>
          </p>
        </div>
        <div className={`${!isEnabledCard[1] ? 'disabled ': ''}p-5 duration-300 transform bg-white shadow-sm hover:-translate-y-2  border-2 rounded shadow-sm border-deep-purple-accent-700 `}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-lg font-bold leading-5">Bet: ${getBetAmount(1)}</p>
            <p className="flex items-center justify-center w-6 h-6 font-bold rounded text-deep-purple-accent-400 bg-indigo-50">
              1
            </p>
          </div>
          <p className="text-sm text-gray-900">
            <b>Win Amount: </b> ${getWinAmount(1)}
          </p>
          <p className="text-sm text-gray-900">
            <b>Net Profit: </b> ${getNetProfit(1)}
          </p>
        </div>
        <div className={`${!isEnabledCard[2] ? 'disabled ': ''}p-5 duration-300 transform bg-white shadow-sm hover:-translate-y-2  border-2 rounded shadow-sm border-deep-purple-accent-700 `}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-lg font-bold leading-5">Bet: ${getBetAmount(2)}</p>
            <p className="flex items-center justify-center w-6 h-6 font-bold rounded text-deep-purple-accent-400 bg-indigo-50">
              2
            </p>
          </div>
          <p className="text-sm text-gray-900">
            <b>Win Amount: </b> ${getWinAmount(2)}
          </p>
          <p className="text-sm text-gray-900">
            <b>Net Profit: </b> ${getNetProfit(2)}
          </p>
        </div>
        <div className={`${!isEnabledCard[3] ? 'disabled ': ''}p-5 duration-300 transform bg-white shadow-sm hover:-translate-y-2  border-2 rounded shadow-sm border-deep-purple-accent-700 `}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-lg font-bold leading-5">Bet: ${getBetAmount(3)}</p>
            <p className="flex items-center justify-center w-6 h-6 font-bold rounded text-deep-purple-accent-400 bg-indigo-50">
              3
            </p>
          </div>
          <p className="text-sm text-gray-900">
            <b>Win Amount: </b> ${getWinAmount(3)}
          </p>
          <p className="text-sm text-gray-900">
            <b>Net Profit: </b> ${getNetProfit(3)}
          </p>
        </div>
        <div className={`${!isEnabledCard[4] ? 'disabled ': ''}p-5 duration-300 transform bg-white shadow-sm hover:-translate-y-2  border-2 rounded shadow-sm border-deep-purple-accent-700 `}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-lg font-bold leading-5">Bet: ${getBetAmount(4)}</p>
            <p className="flex items-center justify-center w-6 h-6 font-bold rounded text-deep-purple-accent-400 bg-indigo-50">
              4
            </p>
          </div>
          <p className="text-sm text-gray-900">
            <b>Win Amount: </b> ${getWinAmount(4)}
          </p>
          <p className="text-sm text-gray-900">
            <b>Net Profit: </b> ${getNetProfit(4)}
          </p>
        </div>
        <div className={`${!isEnabledCard[5] ? 'disabled ': ''}p-5 duration-300 transform bg-white shadow-sm hover:-translate-y-2  border-2 rounded shadow-sm border-deep-purple-accent-700 `}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-lg font-bold leading-5">Bet: ${getBetAmount(5)}</p>
            <p className="flex items-center justify-center w-6 h-6 font-bold rounded text-deep-purple-accent-400 bg-indigo-50">
              5
            </p>
          </div>
          <p className="text-sm text-gray-900">
            <b>Win Amount: </b> ${getWinAmount(5)}
          </p>
          <p className="text-sm text-gray-900">
            <b>Net Profit: </b> ${getNetProfit(5)}
          </p>
        </div>
        <div className={`${!isEnabledCard[6] ? 'disabled ': ''}p-5 duration-300 transform bg-white shadow-sm hover:-translate-y-2  border-2 rounded shadow-sm border-deep-purple-accent-700 `}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-lg font-bold leading-5">Bet: ${getBetAmount(6)}</p>
            <p className="flex items-center justify-center w-6 h-6 font-bold rounded text-deep-purple-accent-400 bg-indigo-50">
              6
            </p>
          </div>
          <p className="text-sm text-gray-900">
            <b>Win Amount: </b> ${getWinAmount(6)}
          </p>
          <p className="text-sm text-gray-900">
            <b>Net Profit: </b> ${getNetProfit(6)}
          </p>
        </div>
        <div className={`${!isEnabledCard[7] ? 'disabled ': ''}p-5 duration-300 transform bg-white shadow-sm hover:-translate-y-2  border-2 rounded shadow-sm border-deep-purple-accent-700 `}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-lg font-bold leading-5">Bet: ${getBetAmount(7)}</p>
            <p className="flex items-center justify-center w-6 h-6 font-bold rounded text-deep-purple-accent-400 bg-indigo-50">
              7
            </p>
          </div>
          <p className="text-sm text-gray-900">
            <b>Win Amount: </b> ${getWinAmount(7)}
          </p>
          <p className="text-sm text-gray-900">
            <b>Net Profit: </b> ${getNetProfit(7)}
          </p>
        </div>
      </div>
      <div className="text-center">
        {isEnabledCard[0] && <a
          href="/"
          onClick={startBetting}
          className="inline-flex items-center justify-center ml-12 w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md md:w-auto bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
        >
          Start Betting
        </a>}
        {!isEnabledCard[0] && <><a
          href="/"
          onClick={initiateLose}
          className="inline-flex items-center justify-center ml-12 w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md md:w-auto bg-red-400 hover:bg-red-700 focus:shadow-outline focus:outline-none"
        >
          LOSE
        </a>
        <a
          href="/"
          onClick={initiateWin}
          className="inline-flex items-center justify-center ml-12 w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md md:w-auto bg-green-400 hover:bg-green-700 focus:shadow-outline focus:outline-none"
        >
          WIN
        </a>
        </>
        }
      </div>
    </div>
    <div className="max-w-xl mt-12 md:mx-auto sm:text-center lg:max-w-2xl">
        <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
          <span className="relative inline-block">
            <svg
              viewBox="0 0 52 24"
              fill="currentColor"
              className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
            >
              <defs>
                <pattern
                  id="d0d83814-78b6-480f-9a5f-7f637616b267"
                  x="0"
                  y="0"
                  width=".135"
                  height=".30"
                >
                  <circle cx="1" cy="1" r=".7" />
                </pattern>
              </defs>
              <rect
                fill="url(#d0d83814-78b6-480f-9a5f-7f637616b267)"
                width="52"
                height="24"
              />
            </svg>
            <span className="relative">Results:</span>
          </span>{' '}
        </h2>
      </div>
    <div className="px-4 py-4 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-4">
    <div className="grid gap-10 row-gap-8 lg:grid-cols-4">
      <div>
        <div className="flex">
          <h6 className="mr-2 text-4xl font-bold md:text-5xl text-deep-purple-accent-400">
            ${(tetherInput ? tetherInput: 0).toFixed(2)}
          </h6>
          
        </div>
        <p className="mb-2 font-bold md:text-lg">Initial Tether</p>
        <p className="text-gray-700">
          Eto yung pera mo bago ka mag start mag bet
        </p>
      </div>
      <div>
        <div className="flex">
          <h6 className="mr-2 text-4xl font-bold md:text-5xl text-deep-purple-accent-400">
            ${currentRemaining.toFixed(2)}
          </h6>
          
        </div>
        <p className="mb-2 font-bold md:text-lg">Current Tether</p>
        <p className="text-gray-700">
          Eto yung actual na pera mo, rounded to 2 digits to ah.
        </p>
      </div>
      <div>
        <div className="flex">
          <h6 className="mr-2 text-4xl font-bold md:text-5xl text-deep-purple-accent-400">
            ${totalLossGainValue.toFixed(2)}
          </h6>
          
        </div>
        <p className="mb-2 font-bold md:text-lg">Actual Gain/Loss</p>
        <p className="text-gray-700">
          Eto yung napanalo mo or napatalo mo currently.
        </p>
      </div>
      <div>
        <div className="flex">
          <h6 className="mr-2 text-4xl font-bold md:text-5xl text-deep-purple-accent-400">
            {(((totalLossGainValue) / (tetherInput ? tetherInput: 0) * 100) ? ((totalLossGainValue) / (tetherInput ? tetherInput: 0) * 100): 0 ).toFixed(2)}%
          </h6>
          
        </div>
        <p className="mb-2 font-bold md:text-lg">Percentage Gain/Loss</p>
        <p className="text-gray-700">
          Eto yung base natin if nahit na yung 5%
        </p>
      </div>
    </div>
    
  </div>
  {!isEnabledCard[0] && 
  <div className="max-w-screen flex items-center justify-end mt-12 sm:max-w-xl md:max-w-full lg:max-w-screen-xl"><a
          href="/"
          onClick={resetBetting}
          className="inline-flex items-center justify-center ml-12 w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md md:w-auto bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
        >
          RESET
        </a></div>}
  </>
  );
}

export default App;
