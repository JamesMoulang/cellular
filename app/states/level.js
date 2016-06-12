import Vector from '../Vector';

var level = {
	nests: [
		{
			pos: new Vector(1024, 0),
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