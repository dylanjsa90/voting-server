import {expect} from 'chai';
import {List, Map} from 'immutable';

describe('immutability', () => {

  describe('A list', () => {
    function addMovie(currentState, movie) {
      return currentState.push(movie);
    }

    
    it('is immutable', () => {
      let state = List.of('Trainspotting', '28 days later');
      let nextState = addMovie(state, 'Avengers');

      expect(nextState).to.equal(List.of(
        'Trainspotting',
        '28 days later',
        'Avengers'
      ));
      expect(state).to.equal(List.of(
        'Trainspotting',
        '28 days later'
      ));
    });
  })

  describe('a tree', () => {
    function addMovie(currentState, movie) {
      return currentState.update('movies', movies => movies.push(movie));
      
    }

    it('is immutable', () => {
      let state = Map({
        movies: List.of('Trainspotting', '28 days later')
      });
      let nextState = addMovie(state, 'Avengers');

      expect(nextState).to.equal(Map({
        movies: List.of(
          'Trainspotting',
          '28 days later',
          'Avengers'
        )
      }));
      expect(state).to.equal(Map({
        movies: List.of(
          'Trainspotting',
          '28 days later'
        )
      }));
    });
  });


})