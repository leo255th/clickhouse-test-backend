export const TableCreateSQL=`
CREATE TABLE my_test.test (
	id UInt32
)
Engine=MergeTree()
ORDER BY (id);
`;