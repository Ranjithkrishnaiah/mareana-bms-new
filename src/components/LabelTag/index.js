/**
 * @author Dinesh Kumar <dinesh.kumar@mareana.com>
 * @Mareana - CPV Product
 * @version  1
 * @Last Modified - 07 April, 2022
 * @Last Changed By - Dinesh
 */
import './style.scss';

const LabelTag = props => {
	return (
		<div className='lable-tag'>
			<p>{props.lableName} : </p>
			<p>{props.lableValue}</p>
		</div>
	);
};

export default LabelTag;
