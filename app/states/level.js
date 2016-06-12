import Vector from '../Vector';

var level = {
	nests: [
		{
			pos: new Vector(1024, 0),
			colours: ['#5BC0EB', '#FDE74C', '#9BC53D', '#E55934', '#FA7921'],
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