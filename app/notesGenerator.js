import _ from 'underscore';
import Note from './entities/Note';

function notesGenerator(notes_array) {
	return _.map(notes_array, function(note, index) {
		return new Note(note < 0, Math.abs(note));
	});
}

export default notesGenerator;
