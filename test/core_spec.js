import {List, Map} from 'immutable';
import {expect} from 'chai';

import {setEntries, next, vote} from '../src/core';

describe('application logic', () => {

  describe('vote', () => {
    it('should not add tally for invalid entry', () => {
      const state = Map({
        pair: List.of('Trainspotting', '28 days later'),
        tally: Map({
          'Trainspotting': 1
        })
      })
      const nextState = vote(state, 'Sunshine');
      expect(nextState).to.equal(Map({
          pair: List.of('Trainspotting', '28 days later'),
          tally: Map({
            'Trainspotting': 1
          })
      }))
    })
    it('creates a tally for the voted entry', () => {
      expect(vote(Map({
          round: 1,
          pair: List.of('Trainspotting', '28 days later')
        }), 'Trainspotting', 'voter1')
      ).to.equal(
        Map({
          round: 1,
          pair: List.of('Trainspotting', '28 days later'),
          tally: Map({
            'Trainspotting': 1
          }),
          votes: Map({
            voter1: 'Trainspotting'
          })
        })
      );
    });

    it('adds to tally for the voted entry', () => {
      expect(
        vote(Map({
          round: 1,
          pair: List.of('Trainspotting', '28 days later'),
          tally: Map({
            'Trainspotting': 3,
            '28 days later': 2
          }),
          votes: Map()
        }), 'Trainspotting', 'voter1')
      ).to.equal(
        Map({
          round: 1,
          pair: List.of('Trainspotting', '28 days later'),
          tally: Map({
            'Trainspotting': 4,
            '28 days later': 2
          }),
          votes: Map({
            voter1: 'Trainspotting'
          })
        })
      );
    });

    it('removes previous vote on duplicate', () => {
      expect(
        vote(Map({
          round: 1,
          pair: List.of('Trainspotting', '28 days later'),
          tally: Map({
            'Trainspotting': 3,
            '28 days later': 2
          }),
          votes: Map({
            voter1: '28 days later'
          })
        }), 'Trainspotting', 'voter1')
      ).to.equal(
        Map({
          round: 1,
          pair: List.of('Trainspotting', '28 days later'),
          tally: Map({
            'Trainspotting': 4,
            '28 days later': 1
          }),
          votes: Map({
            voter1: 'Trainspotting'
          })
        })
      )
    });
    
  });

  describe('next', () => {

    it('marks the winner when one entry remains', () => {
      const state = Map({
        vote: Map({
          round: 5,
          pair: List.of('Trainspotting', '28 days later'),
          tally: Map({
            'Trainspotting': 4,
            '28 days later': 2
          })
        }),
        entries: List()
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        winner: 'Trainspotting'
      }));
    });

    it('takes the next 2 entries to vote on', () => {
      const state = Map({
        entries: List.of('Trainspotting', '28 days later', 'Avengers')
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          round: 1,
          pair: List.of('Trainspotting', '28 days later')
        }),
        entries: List.of('Avengers')
      }));
    });
    
    it('returns the winner of current vote back into entries', () => {
      const state = Map({
        vote: Map({
          round: 0,
          pair: List.of('Trainspotting', '28 days later'),
          tally: Map({
            'Trainspotting': 4,
            '28 days later': 2
          })
        }),
        entries: List.of('Avengers', 'Millions', '127 Hours')
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          round: 1,
          pair: List.of('Avengers', 'Millions')
        }),
        entries: List.of('127 Hours', 'Trainspotting')
      }));
    });

    it('puts both back into entries if vote tied', () => {
      const state = Map({
        vote: Map({
          round: 1,
          pair: List.of('Trainspotting', '28 days later'),
          tally: Map({
            'Trainspotting': 3,
            '28 days later': 3
          })
        }),
        entries: List.of('Avengers', 'Millions', '127 Hours')
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          round: 2,
          pair: List.of('Avengers', 'Millions')
        }),
        entries: List.of('127 Hours', 'Trainspotting', '28 days later')
      }));
    });

  });

  describe('setEntries', () => {

    it('adds the entries to the state', () => {
      const state = Map();
      const entries = List.of('Trainspotting', '28 days later');
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting', '28 days later')
      }));
    });

    it('converts to immutable', () => {
      const state = Map();
      const entries = ['Trainspotting', '28 days later'];
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting', '28 days later')
      }));
    });
    

  });

});