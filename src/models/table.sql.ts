export const TableCreateSQL=`
CREATE TABLE my_test.test2 (
	id UInt32
)
Engine=MergeTree()
ORDER BY (id);
`;