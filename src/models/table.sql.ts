export const TableCreateSQL=`
CREATE TABLE my_test.test (
	id UInt32,
	name String,
	age UInt8,
	time DateTime64(3)
)
Engine=MergeTree()
ORDER BY (id);
`;