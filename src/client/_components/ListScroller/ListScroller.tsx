import React, {
    FunctionComponent,
    Fragment,
    useState,
    ReactElement
} from 'react';

type ListScrollerProps = {};

export const ListScroller: FunctionComponent<ListScrollerProps> = ({
    children
}) => {
    const [offset, setOffset] = useState(0);

    const incOffset = () => {
        setOffset(prev => prev + 1);
    };
    const decOffset = () => {
        setOffset(prev => prev - 1);
    };

    return (
        <Fragment>
            <button disabled={offset === 0} onClick={decOffset}>{`<`}</button>
            {React.cloneElement(children as ReactElement, { offset: offset })}
            <button onClick={incOffset}>{`>`}</button>
        </Fragment>
    );
};
