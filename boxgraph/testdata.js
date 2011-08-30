{
    "colors": ["06799F", "216278", "024E68", "3AAACF", "62B4CF"],
    "boxes":
    [
        {
            "id": 1,
            "name":"foo",
            "x":50,
            "y": 210,
            "height":100,
            "width": 150,
            "ports":
            [
                { "id": 100, "dir": "right", "position": 1},
                { "id": 101, "dir": "up", "position": 3},
				{ "id": 105, "dir": "left", "position": 2}
            ]
        },
        {
            "id": 2,
            "name":"bar",
            "x":250,
            "y": 50,
            "height":50,
            "width": 100,
            "ports":
            [
                { "id": 102, "dir": "left", "position": 2},
                { "id": 103, "dir": "right", "position": 1},
				{ "id": 104, "dir": "down", "position": 1}
            ]
        }
    ],
    "connections":
    [
        {"first": 101, "second": 102},
        {"first": 103, "second": 100}
    ]
}