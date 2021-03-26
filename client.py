import os
import time
import requests
import Entity_pb2 as pb

entities = []


def clear():
    os.system('cls' if os.name == 'nt' else 'clear')


if __name__ == '__main__':
    # get start items
    init_res = requests.get('http://localhost:3000')
    init_entities = pb.InitEntities()
    init_entities.ParseFromString(init_res.content)

    entities.extend([
        init_entities.fire,
        init_entities.water,
        init_entities.air,
        init_entities.ground,
    ])

    while True:
        clear()
        l = len(entities)
        print('Открыто', l, '/14 предметов')
        for i, ent in enumerate(entities):
            print(f"{ent.icon + '#' + str(i):<6}", end='')
            if (i + 1) % 4 == 0 or i + 1 == l:
                print()
        comb_str = input('Соединить предмент: ')
        ai, bi = map(int, comb_str.replace(',', '').split())
        comb = pb.Combination(A=entities[ai], B=entities[bi])
        comb_res = requests.post('http://localhost:3000',
                                 data=comb.SerializeToString(),
                                 headers={'Content-Type': 'application/octet-stream'})

        clear()
        if comb_res.status_code == 200:
            e = pb.Entity()
            e.ParseFromString(comb_res.content)
            entities.append(e)
            print('Новый элемент:', e.name, e.icon)
        else:
            print('Нет реакции')
        time.sleep(3)
