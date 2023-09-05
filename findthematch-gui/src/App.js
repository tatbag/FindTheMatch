import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import CardToken from './abis/CardToken.json'

const CARD_ARRAY = [
  {
    name: 'img1',
    img: '/images/1.png'
  },
  {
    name: 'img2',
    img: '/images/2.png'
  },
  {
    name: 'img3',
    img: '/images/3.png'
  },
  {
    name: 'img4',
    img: '/images/4.png'
  },
  {
    name: 'img5',
    img: '/images/5.png'
  },
  {
    name: 'img6',
    img: '/images/6.png'
  },
  {
    name: 'img1',
    img: '/images/1.png'
  },
  {
    name: 'img2',
    img: '/images/2.png'
  },
  {
    name: 'img3',
    img: '/images/3.png'
  },
  {
    name: 'img4',
    img: '/images/4.png'
  },
  {
    name: 'img5',
    img: '/images/5.png'
  },
  {
    name: 'img6',
    img: '/images/6.png'
  }
]


class App extends Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    this.setState({cardArray: CARD_ARRAY.sort(() => 0.5 - Math.random())})
  }

  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if(window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-ethereum browser. Add metamask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3 
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0]})
    console.log(accounts[0]);

    //Load smart contract
    const networkId = await web3.eth.net.getId()
    const contractAddress = '0xa2be09821ef4a32cdab3bb4eb9ed75f3ca7b61c3'; // should be the actual address
    const abi = CardToken.abi 
    const token = new web3.eth.Contract(abi, contractAddress)
    this.setState({ token })
    let balanceOf = 0;
    //Load tokens
    try {
      balanceOf = await token.methods.balanceOf(accounts[0]).call();
    }
    catch (e) {
      console.log('Error from balance', e);
    }
    
    for(let i = 0; i < balanceOf; i++) {
      try {
        let id = await token.methods.tokenOfOwnerByIndex(accounts[0], i).call()
        let tokenURI = await token.methods.tokenURI(id).call()
        this.setState({
          tokenURIs: [...this.state.tokenURIs, tokenURI]
        })
      }
      catch (e) {
        console.log('Error inside the loop', e);
      }
    }
  }

  chooseImage = (cardId) => {
    cardId = cardId.toString()
    if(this.state.cardsWon.includes(cardId)) {
      return window.location.origin + '/images/white.png'
    } else if(this.state.cardsChosenId.includes(cardId)) {
      return CARD_ARRAY[cardId].img 
    } else {
      return window.location.origin + '/images/blank.png'
    }
  }

  flipCard = async (cardId) => {
    let alreadyChosen = this.state.cardsChosen.length
    this.setState({
      cardsChosen: [...this.state.cardsChosen, this.state.cardArray[cardId].name],
      cardsChosenId: [...this.state.cardsChosenId, cardId]
    })

    if(alreadyChosen === 1) {
      setTimeout(this.checkForMatch, 100)
    }
  }

  checkForMatch = async () => {
    const optionOneId = this.state.cardsChosenId[0]
    const optionTwoId = this.state.cardsChosenId[1]

    if(optionOneId == optionTwoId) {
      alert('You have clicked on the same image!')
    } else if (this.state.cardsChosen[0] === this.state.cardsChosen[1]) {
      alert('You found a match, ' + window.location.origin + CARD_ARRAY[optionOneId].img.toString())
      this.state.token.methods.mint(
        this.state.account,
        window.location.origin + CARD_ARRAY[optionOneId].img.toString()
      )
      .send({ from: this.state.account })
      .on('transactionHash', (hash) => {
        this.setState({
          cardsWon: [...this.state.cardsWon, optionOneId, optionTwoId],
          tokenURIs: [...this.state.tokenURIs, CARD_ARRAY[optionOneId].img]
        })
      })
    } else {
      alert('Sorry, try again')
    }
    this.setState({
      cardsChosen: [],
      cardsChosenId: []
    })
    if (this.state.cardsWon.length === CARD_ARRAY.length) {
      alert('Congratulations! You found them all!')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      token: null,
      tokenURIs: [],
      cardArray: [],
      cardsChosen: [],
      cardsChosenId: [],
      cardsWon: []
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          &nbsp; Your address
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-muted"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1 className="d-4">Collect Yoshi tokens and become extra lucky!</h1>

                <div className="grid mb-4" >
                  {
                    this.state.cardArray.map((card, key) => {
                      return(
                        <img 
                          key={key}
                          src={this.chooseImage(key)}
                          data-id={key}
                          onClick={(event) => {
                            let cardId = event.target.getAttribute('data-id')
                            if(!this.state.cardsWon.includes(cardId.toString())) {
                              this.flipCard(cardId)
                            }
                          }
                          }
                        />
                      )
                    })
                  }

                </div>

                <div>

                  <h5>Yoshi's Collected:<span id="result">&nbsp;{this.state.tokenURIs.length}</span></h5>
                  <div className="grid mb-4" >
                    {this.state.tokenURIs.map((tokenURI, key) => {
                        return(
                          <img 
                            key={key}
                            src={tokenURI}
                          />
                        )
                    })}
                  </div>

                </div>

              </div>

            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
