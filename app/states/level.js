import Vector from '../Vector';

var level = {
	nests: [
		{
			pos: new Vector(0, 0),
			colours: ['#BC412B', '#D7B49E', '#DC602E', '#B8D5B8', '#05A8AA'],
			lKey: 'Gs3',
			rKey: 'Fs4',
			fairies: [
				{
					lNotes: [16, 16, 16, 16],
					rNotes: [-16, -16, -16, -16],
					hint: 'p'
				},

				{
					lNotes: [-16, -16, -16, -16],
					rNotes: [16, 16, 16, 16],
					hint: 'q'
				},
				{
					lNotes: [-16, -16],
					rNotes: [-4, 4, 4, 4, -4, 4, 4, 4]
				},
				{
					lNotes: [-2, 4, 4, 4, 2, -16],
					rNotes: [-32],
				}
			]
		},

		{
			pos: new Vector(0, 2048),
			colours: ['#424651', '#C492B1', '#AF3B6E', '#21FA90', '#BCE7FD'],
			lKey: 'Gs3',
			rKey: 'Fs4',
			fairies: [
				{
					lNotes: [2, -2, -2, 2,2, -2, -2, 2, -16],
					rNotes: [-2, 2, -2, -2,-2, 2, -2, -2, -16]
				},
				{
					lNotes: [3,3,3,3,3,-5,-12],
					rNotes: [2,-2,2,-2,2,-2,2,-2, -16]
				}
			]
		}
	]
};

export default level;