const pb = require('./Entity_pb.js');

const entities = [
    new pb.Entity(['Огонь', '🔥']),
    new pb.Entity(['Вода', '💧']),
    new pb.Entity(['Воздух', '💨']),
    new pb.Entity(['Земля', '🌱']),
    new pb.Entity(['Пар', '🌫️']),
    new pb.Entity(['Вулкан', '🌋']),
    new pb.Entity(['Дождь', '🌧️']),
    new pb.Entity(['Молния', '⚡']),
    new pb.Entity(['Цветок', '🌷']),
    new pb.Entity(['Море', '🌊']),
    new pb.Entity(['Солнце️', '☀️']),
    new pb.Entity(['Радуга', '🌈']),
    new pb.Entity(['Подсолнух', '🌻']),
    new pb.Entity(['Пляж', '🏖️']),
    new pb.Entity(['Гриб', '🍄']),
]

const recipes = [
//   00  01  02  03  04  05  06  07  08  09  10  11  12  13  14   //
    [10,  4, -1,  5, -1, -1,  7, -1, -1, -1, -1, -1, -1, -1, -1], // 00
    [ 4,  9,  6,  8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 01
    [-1,  6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 02
    [ 5,  8, -1, -1, -1, -1, 14, -1, -1, -1, -1, -1, -1, -1, -1], // 03
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 04
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 05
    [ 7, -1, -1, 14, -1, -1, -1, -1, -1, -1, 11, -1, -1, -1, -1], // 06
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 07
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 12, -1, -1, -1, -1], // 08
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 13, -1, -1, -1, -1], // 09
    [-1, -1, -1, -1, -1, -1, 11, -1, 12, 13, -1, -1, -1, -1, -1], // 10
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 11
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 12
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 13
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], // 14
]

const fastify = require('fastify')({ logger: true })

fastify.addContentTypeParser('application/octet-stream', function (req, done) {
    var arr = []
    req.on('data', chunk => { arr.push(Buffer.from(chunk)) })
    req.on('end', () => { done(null, Buffer.concat(arr)) })
})

fastify.post('/', async (req, res) => {
    const { array: [[aName,], [bName,]] } = pb.Combination.deserializeBinary(req.body);
    const ai = entities.findIndex(e => e.array[0] == aName)
    const bi = entities.findIndex(e => e.array[0] == bName)
    const ri = recipes[ai][bi];

    if (ri === -1) {
        res.status(204)
        return;
    }

    res
        .type('application/octet-stream')
        .send(Buffer.from(entities[ri].serializeBinary().buffer));
});

fastify.get('/', async (req, res) => {
    const fire = new pb.Entity();
    fire.setName('Огонь');
    fire.setIcon('🔥');
    const water = new pb.Entity();
    water.setName('Вода');
    water.setIcon('💧');
    const air = new pb.Entity();
    air.setName('Воздух');
    air.setIcon('💨');
    const ground = new pb.Entity();
    ground.setName('Земля');
    ground.setIcon('🌱');

    const initialEntities = new pb.InitEntities();
    initialEntities.setFire(fire);
    initialEntities.setWater(water);
    initialEntities.setAir(air);
    initialEntities.setGround(ground);

    res
        .type('application/octet-stream')
        .send(Buffer.from(initialEntities.serializeBinary().buffer));
});

const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start();
