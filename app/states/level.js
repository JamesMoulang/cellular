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
					lNotes: [-2, 4, 4, 4, 4, -14],
					rNotes: [-32]
				},
				{
					lNotes: [-32],
					rNotes: [-2, 4, 4, 4, 4, -14]
				}
			]
		},

		{
			pos: new Vector(1024+512, 0),
			colours: ['#3D315B', '#9AB87A', '#708B75', '#444B6E', '#F8F991'],
			lKey: 'Gs3',
			rKey: 'Fs4',
			fairies: [
				{
					lNotes: [8, -8, -8, 8, -8, 8, -16],
					rNotes: [-8, 8, -8, -8, 8, -8, 16]
				}
			]
		},

		{	
			pos: new Vector(-1024, 1024),
			lKey: 'Cs4',
			rKey: 'Ds4',
			//background, listen, play, complete, player
			colours: ['#9D8189', '#FFCAD4', '#F4ACB7', '#D8E2DC', '#FFE5D9'],
			fairies: [
				{
					lNotes: [-2, 4, 4, 4, 2, 2, -14],
					rNotes: [-32]
				},
				{
					lNotes: [-32],
					rNotes: [4, 4, -6, 4, 2, 2, -10]
				}
			]
		},

		{
			pos: new Vector(-2048, 1024+2048),
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